import { useRef, useState, useEffect } from "react";

import * as THREE from "three";
// import { CameraHelper } from "three";
// import { DirectionalLightHelper } from "three";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  // useHelper,
  useTexture,
  useProgress,
  Sky,
  ScreenSpace,
  useCursor,
  // Ring
} from "@react-three/drei";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Perf } from "r3f-perf";

import { ItemPart } from "./ItemPart.jsx";
import { Bag } from "./Bag.jsx";
import { Annotation } from "./Annotation.jsx";
import RingCircle from "./RingCircle.jsx";
import { Floor } from "./room/Floor.jsx";
import { Walls } from "./room/Walls.jsx";
// import { ShelfPositions } from "./room/ShelfPositions.jsx";

import controls from "../helpers/debugControls";
import { objects } from "../data/objects.jsx";
import { textures } from "../data/textures.jsx";
import { shopItems } from "../data/objects.jsx";

import useWindowDimensions from "../helpers/useWindowDimensions";
import { useSnipcart } from "use-snipcart";
import { Logo } from "./Logo.jsx";

export default function Scene({
  currentItemSelected,
  setCurrentItemSelected,
  previousItemSelected,
  setPreviousItemSelected,
  animDist,
  showBackground,
  setShowBackground,
  showPartOptions,
  setShowPartOptions,
  animateParts,
}) {
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    console.log("height: ", height);
    console.log("width: ", width);
  }, [height, width]);
  const [targetVec, setTargetVec] = useState(new THREE.Vector3());
  const [mobileView, setMobileView] = useState(false);
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    // Check if using a touch control device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      console.log("mobile view");
      setMobileView(true);
    } else {
      console.log("not mobile view");
      setMobileView(false);
    }
  }, []);

  const snipcart = useSnipcart();
  const { cart = {} } = useSnipcart();
  const { subtotal = "0.00" } = cart;
  const [snipcartLoaded, setSnipcartLoaded] = useState(false);

  useEffect(() => {
    // console.log("snipcartLoaded: ", snipcartLoaded);
    // console.log("useSnipcart: ", snipcart);
    // let state = snipcart.getState();
    // console.log("snipCart state: ", state);
    // console.log("cart:", cart);
    // if (cart.items) {
    // console.log("cart.items.count:", cart.items.count);
    // }
    // console.log("subtotal:", subtotal);
    if (window.Snipcart) {
      if (!snipcartLoaded) {
        setSnipcartLoaded(true);
        // console.log("window.Snipcart.api: ", window.Snipcart);
      }
      // window.Snipcart.api.theme.cart.open();
    }
  }, [cart]);

  // const unsubscribe = window.Snipcart.events.on("item.removed", (cartItem) => {
  //   console.log("item removed: ", cartItem);
  // });

  useEffect(() => {
    if (snipcartLoaded) {
      // console.log("snipcartLoaded: ", snipcartLoaded);
      // console.log(window.Snipcart);
      if (window.Snipcart.events) {
        // console.log("events loaded");
        window.Snipcart.events.on("item.removed", (cartItem) => {
          console.log("item removed: ", cartItem);
        });
      }
    }
  }, [snipcartLoaded]);

  function handleCartClick() {
    if (snipcartLoaded) {
      window.Snipcart.api.theme.cart.open();
    }
  }

  const [
    colorMapWhiteStain,
    // displacementMap,
    normalMapWhiteStain,
    roughnessWhiteMapStain,
    metalnessWhiteMapStain,
    // aoMap,
  ] = useTexture(textures.whiteTexture);

  const [
    colorMapNaturalStain,
    // displacementMap,
    normalMapNaturalStain,
    roughnessNaturalMapStain,
    metalnessNaturalMapStain,
    // aoMap,
  ] = useTexture(textures.naturalTexture);

  const [
    colorMapBlackStain,
    // displacementMap,
    normalMapBlackStain,
    roughnessBlackMapStain,
    metalnessBlackMapStain,
    // aoMap,
  ] = useTexture(textures.blackTexture);

  const [
    colorMapAllBlackStain,
    // displacementMap,
    normalMapAllBlackStain,
    roughnessAllBlackMapStain,
    metalnessAllBlackMapStain,
    // aoMap,
  ] = useTexture(textures.allBlackTexture);

  const [
    colorMapPainted,
    // displacementMapPainted,
    normalMapPainted,
    roughnessMapPainted,
    metalnessMapPainted,
    // aoMapPainted,
  ] = useTexture(textures.paintedTexture);

  const dirLightA = useRef();

  const loadingBarElement = document.querySelector(".loading-bar");
  const { active, progress, errors, item, loaded, total } = useProgress();
  const overlayOpacity = { value: 1 };
  const [overlayAlpha, setOverlayAlpha] = useState(1);
  const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uAlpha: { value: overlayAlpha },
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.153, 0.153, 0.102, uAlpha);
        }
    `,
  });

  useEffect(() => {
    loadingBarElement.style.transform = `scaleX(${progress / 100})`;
    if (progress == 100) {
      window.setTimeout(() => {
        // animate overlay
        gsap.to(overlayOpacity, {
          duration: 3,
          value: 0,
          delay: 1,
          onUpdate: () => {
            setOverlayAlpha(overlayOpacity.value);
          },
          onComplete: () => {
            // setInitialLoad(true);
          },
        });
        // update loadingBarElement
        loadingBarElement.classList.add("ended");
        loadingBarElement.style.transform = "";
      }, 500);
    }
    // console.log(overlayGeometry);
  }, [progress]);

  const debugControls = controls();
  const [initialLoad, setInitialLoad] = useState(false);
  // const [showBackground, setShowBackground] = useState(true);
  // const [showPartOptions, setShowPartOptions] = useState(false);
  const [controlsDragging, setControlsDragging] = useState(false);
  // const [cameraPosition, setCameraPosition] = useState(null);

  const [hovered, hover] = useState(false);
  useCursor(hovered);

  const [currentPartName, setCurrentPartName] = useState("top");
  const [currentItemName, setCurrentItemName] = useState("gramps");

  useEffect(() => {
    if (!showBackground && !showPartOptions) {
      console.log(
        "showBackground false and showPartOptions false so fetching objects[thisItemName].parts[0].itemName: ",
        objects[currentItemSelected.itemName].parts[0].itemName,
      );
      setCurrentItemName(
        objects[currentItemSelected.itemName].parts[0].itemName,
      );
      setCurrentPartName(
        objects[currentItemSelected.itemName].parts[0].partName,
      );
      setShowPartOptions(true);
    }
  }, [showBackground]);

  const handleClick = (e) => {
    e.stopPropagation();
    const { eventObject } = e;
    // console.log(eventObject.position);
    let tempObjectPosition = eventObject.position;
    let positionMatch = (element) =>
      element.position.x === tempObjectPosition.x &&
      element.position.y === tempObjectPosition.y &&
      element.position.z === tempObjectPosition.z;

    if (positionMatch) {
      // console.log(
      //   "shopItems.find(positionMatch): ",
      //   shopItems.find(positionMatch),
      // );
      let matchedItem = shopItems.find(positionMatch);
      // console.log("matchedItem from handleClick function: ", matchedItem);
      setPreviousItemSelected(currentItemSelected);
      setCurrentItemSelected(matchedItem);
      // if (!showBackground) {
      //   setShowPartOptions(true);
      // }
    }
  };

  const handleItemPartClick = (e, part) => {
    // e.stopPropagation();
    // console.log(part.itemName, part.partName, " clicked");
    setCurrentItemName(part.itemName);
    setCurrentPartName(part.partName);
    if (!showBackground) {
      setShowPartOptions(true);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setShowBackground(!showBackground);
    animateParts();
  };

  // const handleOffClick = (e) => {
  //   e.stopPropagation();
  //   // console.log("onPointerMissed click");
  // };

  const orbitRef = useRef();
  // const shadowCameraRef = useRef();
  // useHelper(shadowCameraRef, CameraHelper, 1, "lightBlue");

  useEffect(() => {
    // setInitialLoad(true);
    if (orbitRef.current) {
      // console.log(orbitRef.current.object);
      setTargetVec(currentItemSelected.position);

      orbitRef.current.addEventListener(
        "start",
        () => {
          // console.log("start");
          setControlsDragging(true);
          orbitRef.current.autoRotate = false;
        },
        true,
      );
      // orbitRef.current.addEventListener(
      //   "change",
      //   () => {
      //     console.log("change");
      //     setControlsDragging(true);
      //   },
      //   true,
      // );
      orbitRef.current.addEventListener(
        "end",
        () => {
          // console.log("end");
          // setCameraPosition(orbitRef.current.object.position);
          setControlsDragging(false);
        },
        true,
      );
    }
    return () => {
      if (orbitRef.current) {
        orbitRef.current.removeEventListener(
          "start",
          () => console.log("removed event listener, 'start'"),
          true,
        );
        // orbitRef.current.removeEventListener(
        //   "change",
        //   () => console.log("removed event listener, 'change'"),
        //   true,
        // );
        orbitRef.current.removeEventListener(
          "end",
          () => console.log("removed event listener, 'end'"),
          true,
        );
        setControlsDragging(false);
      }
    };
  }, []);

  const controlsTargetVec = new THREE.Vector3();
  // const controlsPositionVec = new THREE.Vector3();

  useGSAP(() => {
    if (previousItemSelected.itemName.includes("shelf")) {
      controlsTargetVec.set(
        previousItemSelected.position.x,
        previousItemSelected.position.y + 1,
        previousItemSelected.position.z,
      );
    } else {
      controlsTargetVec.set(
        previousItemSelected.position.x,
        previousItemSelected.position.y,
        previousItemSelected.position.z,
      );
    }

    if (
      currentItemSelected.itemName !== "noSelect" &&
      !currentItemSelected.itemName.includes("shelf")
    ) {
      let tl = gsap.timeline();
      tl.to(controlsTargetVec, {
        delay: 0.15,
        duration: 0.75,
        x: currentItemSelected.position.x,
        y: currentItemSelected.position.y,
        z: currentItemSelected.position.z,
        ease: "easeIn",
        // onStart: () => {
        //   console.log("targetVec: ", targetVec);
        // },
        onUpdate: () => {
          setTargetVec(controlsTargetVec);
          orbitRef.current.target.set(
            controlsTargetVec.x,
            controlsTargetVec.y,
            controlsTargetVec.z,
          );
          orbitRef.current.object.updateProjectionMatrix();
          orbitRef.current.update();
        },
      });
    } else if (currentItemSelected.itemName.includes("shelf")) {
      let tl = gsap.timeline();
      tl.to(controlsTargetVec, {
        delay: 0.15,
        duration: 0.75,
        x: currentItemSelected.position.x,
        y: currentItemSelected.position.y + 1,
        z: currentItemSelected.position.z,
        ease: "easeIn",
        // onStart: () => {
        //   console.log("targetVec: ", targetVec);
        // },
        onUpdate: () => {
          setTargetVec(controlsTargetVec);
          orbitRef.current.target.set(
            controlsTargetVec.x,
            controlsTargetVec.y,
            controlsTargetVec.z,
          );
          orbitRef.current.object.updateProjectionMatrix();
          orbitRef.current.update();
        },
      });
    }
  }, [currentItemSelected]);

  // useFrame(() => {
  //   if (
  //     !controlsDragging &&
  //     orbitRef.current &&
  //     currentItemSelected.itemName !== "noSelect" &&
  //     !showBackground
  //   ) {
  //     // if (cameraPosition == null) {
  //     // orbitRef.current.object.position.lerp(
  //     //   controlsPositionVec.set(0, 45, 0),
  //     //   0.01,
  //     // );
  //     if (currentItemSizeSelectIndex === 0) {
  //       orbitRef.current.object.position.lerp(
  //         controlsPositionVec.set(
  //           currentItemSelected.positionA.x * 4, // * 6
  //           currentItemSelected.positionA.y + 7 * 4, // * 6
  //           currentItemSelected.positionA.z * 4, // * 6
  //         ),
  //         0.03,
  //       );
  //     } else if (currentItemSizeSelectIndex === 1) {
  //       orbitRef.current.object.position.lerp(
  //         controlsPositionVec.set(
  //           currentItemSelected.positionB.x * 4, // * 6
  //           currentItemSelected.positionB.y + 7 * 4, // * 6
  //           currentItemSelected.positionB.z * 4, // * 6
  //         ),
  //         0.03,
  //       );
  //     }

  //     orbitRef.current.object.updateProjectionMatrix();
  //     orbitRef.current.update();
  //   }
  // else if (!showBackground) {
  //   orbitRef.current.object.position.lerp(
  //     currentItemSelected.position.x * 4, // * 6
  //     currentItemSelected.position.y + 7 * 4, // * 6
  //     currentItemSelected.position.z * 4, // * 6
  //     0.01,
  //   );
  // }
  // return null;
  // });

  const stagePositionY = -0.14;

  const dirLightXPosition = 2.5;
  const dirLightYPosition = 3.6;
  const dirLightZPosition = -3;

  const dirLightIntensity = 1.5;
  const dirLightNormBias = 0.1; // 0.04 previously, adjusted to reduce shadow acne on Block inner shelf cavities
  const dirLightMapSize = 512;
  const dirLightCamNear = -5;
  const dirLightCamFar = 8;
  const dirLightCamLeft = -5;
  const dirLightCamRight = 5;
  const dirLightCamBottom = -5;
  const dirLightCamTop = 5;

  const ambLightIntensity = 1.5;

  const animatedPosition = (animation, animDist) => {
    let x = 0;
    let y = 0;
    let z = 0;
    switch (animation) {
      case "negX":
        x = -animDist;
        break;
      case "posX":
        x = animDist;
        break;
      case "negZ":
        z = -animDist;
        break;
      case "posZ":
        z = animDist;
        break;
      case "posY1":
        y = animDist;
        break;
      case "posY2":
        y = animDist + animDist / 2;
        break;
      case "none":
        break;
    }
    let position = [x, y, z];
    return position;
  };

  return (
    <>
      <ScreenSpace depth={1}>
        <pointLight position={[width / 2850, 0.2, 0.1]} intensity={0.15} />
        <mesh
          position={
            width > 414
              ? [width / 2850, 0.345, 0]
              : width <= 932 && width > 414
                ? [0.5, 0.345, 0] // this value needs to be refined, hasn't been tested yet
                : [0.19, 0.345, 0]
          }
          scale={0.125}
          onClick={handleCartClick}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <Bag
            currentColor={textures.brownBag}
            currentTexture={textures.paintedTexture}
            cartCount={cart.items ? cart.items.count : 0}
            handleCartClick={handleCartClick}
          />
        </mesh>
        <mesh
          position={
            width > 414
              ? [-width / 3075, 0.36, 0]
              : width <= 932 && width > 414
                ? [-0.5, 0.36, 0] // this value needs to be refined, hasn't been tested yet
                : [-0.19, 0.36, 0]
          }
          // rotation={[0, Math.PI / 24, Math.PI]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          scale={0.005}
        >
          {/* <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshStandardMaterial /> */}
          <Logo
            currentColor={textures.blueTape}
            currentTexture={textures.paintedTexture}
          />
        </mesh>
      </ScreenSpace>
      {debugControls.perfVisible && <Perf position="top-left" />}
      <color args={["#27271a"]} attach="background" />
      <mesh geometry={overlayGeometry} material={overlayMaterial}></mesh>
      <OrbitControls
        makeDefault
        ref={orbitRef}
        enableZoom={true}
        enablePan={false}
        maxDistance={15}
        minDistance={1.375} // 60
        maxPolarAngle={Math.PI / 2 + Math.PI / 16} // {Math.PI / 2 - Math.PI / 16}
        enableDamping={true}
        autoRotate
        autoRotateSpeed={0.8}
      />
      <Sky distance={55} sunPosition={[40, 8.5, -50]} />
      {/* grampsLight */}
      <directionalLight
        castShadow
        ref={dirLightA}
        position={[dirLightXPosition, dirLightYPosition, dirLightZPosition]} // {[0, 60, 0]}
        intensity={dirLightIntensity}
        shadow-normalBias={dirLightNormBias}
        shadow-mapSize-width={dirLightMapSize} // 5120
        shadow-mapSize-height={dirLightMapSize}
        shadow-camera-near={dirLightCamNear} // 50
        shadow-camera-far={dirLightCamFar} // 115
        shadow-camera-left={dirLightCamLeft} // -10
        shadow-camera-bottom={dirLightCamBottom} // -10
        shadow-camera-right={dirLightCamRight} // 10
        shadow-camera-top={dirLightCamTop} // 150
        // target={grampsRef.current}
      />
      {/* all objects (except logo and cart/bag) */}
      <group position={[0, stagePositionY, 0]}>
        <ambientLight intensity={ambLightIntensity} />
        {/* furniture items */}
        {shopItems.map((item, index) => {
          return (
            <group
              key={index}
              position={[item.position.x, item.position.y, item.position.z]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
            >
              {item.parts.map((part, index) => {
                return (
                  <group
                    key={part.partName}
                    onClick={(e) => handleItemPartClick(e, part)}
                  >
                    <mesh position={animatedPosition(part.animation, animDist)}>
                      <ItemPart
                        model={part.model}
                        itemName={part.itemName}
                        partName={part.partName}
                      />
                    </mesh>
                    <Annotation
                      model={part.model}
                      itemName={part.itemName}
                      partName={part.partName}
                      descPartName={part.descPartName}
                      animation={part.animation}
                      animDist={animDist}
                      currentItemName={currentItemName}
                      currentPartName={currentPartName}
                      showBackground={showBackground}
                      setShowBackground={setShowBackground}
                      showPartOptions={showPartOptions}
                      setShowPartOptions={setShowPartOptions}
                    />
                    <RingCircle
                      selected={currentItemSelected === item ? true : false}
                      showBackground={showBackground}
                    />
                  </group>
                );
              })}
            </group>
          );
        })}
        {/* floor */}
        <mesh
          visible={showBackground}
          position={[0, -0.498, 0]}
          // onClick={handleOffClick}
        >
          <Floor
            currentColor={textures.whiteStain}
            currentTexture={textures.woodFloorWornPlanksTexture}
          />
        </mesh>

        {/* wallsAndMoulding */}
        <mesh
          visible={showBackground}
          // onClick={handleOffClick}
        >
          <Walls
            currentColor={textures.grayPaint} // whiteStain
            currentTexture={textures.paintedTexture}
          />
        </mesh>
        {/* shelfPositions */}
        {/* <mesh>
          <ShelfPositions />
        </mesh> */}
      </group>
    </>
  );
}
