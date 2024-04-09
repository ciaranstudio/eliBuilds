import React, { useState, useLayoutEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import InfoBoxAll from "./InfoBoxAll.jsx";
import PhotoBoxAll from "./PhotoBoxAll.jsx";
// import { useOptionStore } from "../store/useOptionStore.tsx";

export const ArrowIcon = ({
  currentColor,
  currentTexture,
  // item,
  currentItemSelected,
  toggleInfoBox,
  open,
  showLongDesc,
  togglePhotoBox,
  showPhotos,
}) => {
  const { scene, nodes, materials } = useGLTF("./models/arrow.gltf");
  const [annotations, setAnnotations] = useState([]);

  const [
    map,
    // displacementMap,
    normalMap,
    roughnessMap,
    metalnessMap,
    // aoMap,
  ] = useTexture(currentTexture);

  useLayoutEffect(() => {
    Object.assign(materials.Material, {
      map: map,
      // displacementMap: displacementMap,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      metalnessMap: metalnessMap,
      // aoMap: aoMap,
      color: currentColor,
    });
  }, [
    scene,
    nodes,
    materials,
    currentColor,
    currentTexture,
    map,
    normalMap,
    roughnessMap,
    metalnessMap,
  ]);

  useLayoutEffect(() => {
    const currentAnnotations = [];
    scene.traverse((o) => {
      // console.log("o from scene.traverse in Annotations: ", o);
      if (o.isObject3D) {
        if (o.userData.name) {
          if (o.userData.name.startsWith("AnchorPoint")) {
            // console.log(o.userData.name);
            currentAnnotations.push(
              <group
                key={o.uuid}
                position={[o.position.x, o.position.y, o.position.z]}
              >
                <InfoBoxAll
                  item={currentItemSelected}
                  // currentItemSelected={currentItemSelected}
                  toggleInfoBox={toggleInfoBox}
                  open={open}
                  showLongDesc={showLongDesc}
                />
                <PhotoBoxAll
                  item={currentItemSelected}
                  // currentItemSelected={currentItemSelected}
                  togglePhotoBox={togglePhotoBox}
                  showPhotos={showPhotos}
                />
              </group>,
            );
          }
        }
      }
    });
    setAnnotations(currentAnnotations);
  }, [scene, open, togglePhotoBox, showPhotos]);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = false;
        o.receiveShadow = true;
        o.material.roughness = 1;
        o.material.metalness = 0;
        // o.material.map.colorSpace = THREE.SRGBColorSpace;
        // console.log(o.material);
      }
    });
  }, []);

  // return <primitive object={scene} />;
  return <primitive object={scene}>{annotations}</primitive>;
};
