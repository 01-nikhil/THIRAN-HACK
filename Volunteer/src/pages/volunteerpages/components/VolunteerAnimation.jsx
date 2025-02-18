import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const scootyImg = "/scooter-svgrepo-com.svg"; // Scooty Image (977x738)

const VolunteerAnimation = ({ onAnimationComplete }) => {
  const scootyRef = useRef(null);

  useEffect(() => {
    console.log("Animation started");

    const tl = gsap.timeline({
      onComplete: onAnimationComplete,
    });

    // Slower scooty movement (20s duration)
    tl.fromTo(
      scootyRef.current,
      { x: "-120vw", rotate: -5 },
      { x: "100vw", rotate: 10, duration: 20, ease: "power2.out" }
    );
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      {/* Scooty */}
      <img
        ref={scootyRef}
        src={scootyImg}
        alt="Scooty Delivery"
        className="absolute"
        style={{
          width: "200px",
        }}
      />
    </div>
  );
};

export default VolunteerAnimation;
