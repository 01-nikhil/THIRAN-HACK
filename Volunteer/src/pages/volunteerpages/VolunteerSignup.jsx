"use client"

import { useState, useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { motion } from "framer-motion"
import { Button } from "./components/button"
import { Input } from "./components/input"
import { Label } from "./components/label"
import { RadioGroup, RadioGroupItem } from "./components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/select"
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog"
import { Checkbox } from "./components/checkbox"
import { MapPin } from "lucide-react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { useVolunteerStore } from "../../store/useVolunteerStore"
import VolunteerAnimation from "./components/VolunteerAnimation"

export default function VolunteerSignUp() {
  const [volunteerType, setVolunteerType] = useState("individual")
  const { signup } = useVolunteerStore()
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState({
    lat: 11.0168,
    lng: 76.9558,
  })
  const [isLocating, setIsLocating] = useState(false)
  const [isAgreementOpen, setIsAgreementOpen] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    volunteerType: "individual",
    organizationName: "",
    contactPerson: "",
    dob: "",
    gender: "",
    contactNumber: "",
    aadhaarNumber: "",
    city: "",
    location: {
      latitude: "11.0168",
      longitude: "76.9558",
      address: ""
    },
    aadhaarFile: "",
    agreement: false,
  })

  const [showAnimation, setShowAnimation] = useState(false);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const mapStyles = {
    height: "100%",
    width: "100%",
  }

  const mapContainerStyle = {
    height: "300px",
    width: "100%",
  }

  const [map, setMap] = useState(null)
  const mapRef = useRef(null)

  const onLoad = (map) => {
    mapRef.current = map
    setMap(map)
  }

  const onUnmount = () => {
    setMap(null)
  }

  const handleMapClick = (event) => {
    const lat = event.latLng.lat().toString()
    const lng = event.latLng.lng().toString()
    setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) })
    updateLocationInfo(lat, lng)
  }

  const updateLocationInfo = (lat, lng) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const formattedAddress = data.results[0].formatted_address
          setLocation(formattedAddress)
          setFormData((prev) => ({
            ...prev,
            location: { 
              latitude: lat, 
              longitude: lng,
              address: formattedAddress
            },
          }))
        } else {
          setLocation("Location not found")
        }
      })
      .catch((error) => {
        console.error("Error fetching location:", error)
        setLocation("Error fetching location.")
      })
  }

  const detectCurrentLocation = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toString()
          const longitude = position.coords.longitude.toString()
          setCoordinates({ lat: parseFloat(latitude), lng: parseFloat(longitude) })
          updateLocationInfo(latitude, longitude)
          setIsLocating(false)

          if (mapRef.current) {
            mapRef.current.panTo({ lat: parseFloat(latitude), lng: parseFloat(longitude) })
            mapRef.current.setZoom(15)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocation("Error detecting location. Please try again.")
          setIsLocating(false)
        },
      )
    } else {
      setLocation("Geolocation is not supported by your browser.")
      setIsLocating(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === "file") {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [name]: reader.result
        })
      }
      reader.readAsDataURL(files[0])
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleTypeChange = (value) => {
    setVolunteerType(value)
    setFormData({
      ...formData,
      volunteerType: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.agreement) {
      alert("Please agree to the terms and conditions")
      return
    }

    if (!coordinates.lat || !coordinates.lng) {
      alert("Please select a location on the map")
      return
    }

    try {
      const volunteerData = {
        ...formData,
        location: {
          latitude: coordinates.lat.toString(),
          longitude: coordinates.lng.toString(),

          address: location || ''
        }
      }

      if (volunteerData.volunteerType === 'individual') {
        if (!volunteerData.fullName || !volunteerData.dob || !volunteerData.gender || !volunteerData.aadhaarNumber || !volunteerData.aadhaarFile) {
          alert("Please fill all required fields for individual volunteer")
          return
        }
      } else if (volunteerData.volunteerType === 'organization') {
        if (!volunteerData.organizationName || !volunteerData.contactPerson) {
          alert("Please fill all required fields for organization")
          return
        }
      }

      if (!volunteerData.email || !volunteerData.password || !volunteerData.contactNumber || !volunteerData.city) {
        alert("Please fill all required fields")
        return
      }

      console.log('Form Data:', volunteerData)

      await signup(volunteerData)
      // setShowAnimation(true);
      setFormData({
        email: "",
        fullName: "",
        password: "",
        volunteerType: "individual",
        organizationName: "",
        contactPerson: "",
        dob: "",
        gender: "",
        contactNumber: "",
        aadhaarNumber: "",
        city: "",
        location: {
          latitude: "",
          longitude: "",
          address: ""
        },
        aadhaarFile: "",
        agreement: false,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      alert(error.message || "Error submitting form. Please try again.")
    }
  }   
  const renderLocationSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={detectCurrentLocation}
          disabled={isLocating}
          className="w-full"
        >
          {isLocating ? "Detecting Location..." : "Detect Current Location"}
        </Button>

        <div className="h-64 w-full rounded-lg overflow-hidden">
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={11}
              center={coordinates}
              onClick={handleMapClick}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              {coordinates.lat && coordinates.lng && (
                <Marker position={coordinates} />
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <Input
          type="text"
          placeholder="Selected location will appear here"
          value={location}
          readOnly
        />

        <div className="text-sm text-gray-600">
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderOrganizationForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="organizationName">Organization Name</Label>
          <Input
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {renderLocationSection()}
    </>
  )

  const renderIndividualForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) =>
                handleChange({ target: { name: "gender", value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
          <Input
            id="aadhaarNumber"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="aadhaarFile">Upload Aadhaar Card</Label>
          <Input
            id="aadhaarFile"
            name="aadhaarFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {renderLocationSection()}
    </>
  )

  return (
    <>
    {showAnimation ? (
      <VolunteerAnimation onAnimationComplete={() => setShowAnimation(false)} />
    ) : (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Volunteer Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Volunteer Type</Label>
              <RadioGroup
                value={volunteerType}
                onValueChange={handleTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organization" id="organization" />
                  <Label htmlFor="organization">Organization</Label>
                </div>
              </RadioGroup>
            </div>
            <motion.div
              key={volunteerType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              >
              {volunteerType === "organization"
                ? renderOrganizationForm()
                : renderIndividualForm()}
            </motion.div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">
                Agreement & Consent
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  ✅ I certify that all the information provided is true and
                  correct.
                </p>
                <p>✅ I authorize Zero Hunger to verify my details.</p>
                <p>✅ I commit to adhering to the ethical guidelines.</p>
                <p>
                  ✅ I understand that Zero Hunger is not liable for any
                  personal injury.
                </p>
                <p>✅ I consent to the terms and conditions.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreement"
                  name="agreement"
                  checked={formData.agreement}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { name: "agreement", type: "checkbox", checked },
                    })
                  }
                  required
                  />
                <Label htmlFor="agreement">I agree to the terms</Label>
              </div>
            </div>

            <Dialog open={isAgreementOpen} onOpenChange={setIsAgreementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Full Agreement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Volunteer Agreement</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  <p>
                    This Volunteer Agreement outlines the terms and conditions
                    for volunteering with Zero Hunger. By agreeing to
                    volunteer, you acknowledge and accept the following: 1.
                    Accuracy of Information: You certify that all information
                    provided during registration is true, accurate, and
                    complete to the best of your knowledge. 2. Verification:
                    You authorize Zero Hunger to verify any information
                    provided, including contacting references and conducting
                    background checks if necessary. 3. Ethical Guidelines: You
                    commit to adhering to Zero Hunger's ethical guidelines and
                    code of conduct, which includes maintaining
                    confidentiality, respecting others, and acting in the best
                    interest of those we serve. 4. Liability: You understand
                    that volunteering may involve risks, and Zero Hunger is not
                    liable for any personal injury, illness, or property damage
                    that may occur during your volunteer activities. 5. Terms
                    and Conditions: You consent to Zero Hunger's general terms
                    and conditions, including policies on data protection,
                    intellectual property, and dispute resolution. 6.
                    Voluntary Service: You acknowledge that your service is
                    voluntary and without compensation or benefits. 7.
                    Termination: Either party may terminate this agreement at
                    any time, with or without cause. By checking the agreement
                    box, you confirm that you have read, understood, and agree
                    to these terms.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
  </>
  )
}
