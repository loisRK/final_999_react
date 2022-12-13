import React, { useRef, useEffect, useState } from "react";

export function currentPositions() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
            var positions = position.coords;
            },
            function (error) {
            console.error(error);
            }
        );
    
        } else {
        console.log("GPS를 지원하지 않습니다.");
        }
  };