import React, { useLayoutEffect } from "react";
import { useGLTF, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
// import { useOptionStore } from "../store/useOptionStore.tsx";

export const Icon = ({
  // map,
  // // displacementMap,
  // normalMap,
  // roughnessMap,
  // metalnessMap,
  // // aoMap,
  currentColor,
  currentTexture,
  // model,
  // animationType,
  // itemName,
  // partName,
}) => {
  const { scene, nodes, materials } = useGLTF("./models/bag.gltf");

  // const repeatVal = 3;
  // // map.minFilter = THREE.LinearFilter;
  // // map.magFilter = THREE.NearestFilter;
  // // map.colorSpace = THREE.SRGBColorSpace;

  // map.wrapS = THREE.RepeatWrapping;
  // map.wrapT = THREE.RepeatWrapping;
  // map.repeat.set(repeatVal, repeatVal);

  // displacementMap.wrapS = THREE.RepeatWrapping;
  // displacementMap.wrapT = THREE.RepeatWrapping;
  // displacementMap.repeat.set(repeatVal, repeatVal);

  // aoMap.wrapS = THREE.RepeatWrapping;
  // aoMap.wrapT = THREE.RepeatWrapping;
  // aoMap.repeat.set(repeatVal, repeatVal);

  // // normalMap.minFilter = THREE.LinearFilter;
  // // normalMap.magFilter = THREE.NearestFilter;

  // normalMap.wrapS = THREE.RepeatWrapping;
  // normalMap.wrapT = THREE.RepeatWrapping;
  // normalMap.repeat.set(repeatVal, repeatVal);

  // // roughnessMap.minFilter = THREE.LinearFilter;
  // // roughnessMap.magFilter = THREE.NearestFilter;

  // roughnessMap.wrapS = THREE.RepeatWrapping;
  // roughnessMap.wrapT = THREE.RepeatWrapping;
  // roughnessMap.repeat.set(repeatVal, repeatVal);
  // const currentPartColor = useOptionStore(
  //   (state) => state.items[itemName].parts[partName].color,
  // );
  // const currentPartTexture = useOptionStore(
  //   (state) => state.items[itemName].parts[partName].texture,
  // );

  const [
    map,
    // displacementMap,
    normalMap,
    roughnessMap,
    metalnessMap,
    // aoMap,
  ] = useTexture(currentTexture);

  useLayoutEffect(() => {
    Object.assign(materials._0043_SaddleBrown, {
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

  // useLayoutEffect(
  //   () =>
  //     scene.traverse(
  //       (o) => o.isMesh && (o.castShadow = o.receiveShadow = true),
  //     ),
  //   [],
  // );

  // useLayoutEffect(
  //   () => scene.traverse((o) => o.isMesh && (o.material.metalness = 0)),
  //   [],
  // );

  const annotations = [];

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o.userData.prop) {
        console.log("o.userData: ", o.userData);
        annotations.push(
          <Html
            key={o.uuid}
            position={[o.position.x, o.position.y, o.position.z]}
            distanceFactor={0.5}
          >
            <div className="annotation">{o.userData.prop}</div>
          </Html>,
        );
      }
    });
  }, []);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.material.roughness = 1;
        o.material.metalness = 0;
        // o.material.map.colorSpace = THREE.SRGBColorSpace;
        console.log(o.material);
      }
    });
  }, []);

  return <primitive object={scene} />;
};