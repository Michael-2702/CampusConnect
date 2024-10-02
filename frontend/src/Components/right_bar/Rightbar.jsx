import React from "react";
import Online from "../online/Online";

export default function Rightbar() {
  return (
    <>
      <div className="sticky top-0 h-screen overflow-y-auto p-4">
        <h4 className="mt-5 text-[20px]">Online Friends</h4>
        <ul>
          <Online />
          <Online />
          <Online />
          <Online />
        </ul>
      </div>
    </>
  );
}