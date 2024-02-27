// import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import controls from "./debugControls";
import * as THREE from "three";

export default function RoomPanels(props) {
  const debugControls = controls();
  // const settingEdgeRef = useRef();

  // const woodMaterial = {
  //   metalness: debugControls.metalness,
  //   roughness: debugControls.roughness,
  //   displacementScale: 0,
  //   map: colorMap,
  //   displacementMap: displacementMap,
  //   normalMap: normalMap,
  //   metalnessMap: metalnessMap,
  //   roughnessMap: roughnessMap,
  //   aoMap: aoMap,
  //   color: props.currentItemSelected.itemColor,
  //   wireframe: debugControls.wireframe,
  // }  // const settingEdgeRef = useRef();

  const [
    concretePouredColorMap,
    concretePouredDisplacementMap,
    concretePouredNormalMap,
    concretePouredMetalnessMap,
    concretePouredRoughnessMap,
    concretePouredAoMap,
  ] = useLoader(TextureLoader, [
    "./ConcretePoured001/ConcretePoured001_COL_2K_METALNESS.png",
    "./ConcretePoured001/ConcretePoured001_DISP_2K_METALNESS.png",
    "./ConcretePoured001/ConcretePoured001_NRM_2K_METALNESS.png",
    "./ConcretePoured001/ConcretePoured001_METALNESS_2K_METALNESS.png",
    "./ConcretePoured001/ConcretePoured001_ROUGHNESS_2K_METALNESS.png",
    "./ConcretePoured001/ConcretePoured001_AO_2K_METALNESS.png",
  ]);

  const concretePouredMaterial = {
    // metalness: debugControls.metalness,
    // roughness: debugControls.roughness,
    displacementScale: 0,
    map: concretePouredColorMap,
    displacementMap: concretePouredDisplacementMap,
    normalMap: concretePouredNormalMap,
    metalnessMap: concretePouredMetalnessMap,
    roughnessMap: concretePouredRoughnessMap,
    aoMap: concretePouredAoMap,
    wireframe: debugControls.wireframe,
  };

  return (
    <>
      {/* wall (front wall, behind the camera on initial load) */}
      <mesh
        receiveShadow
        position={[0, 35, 65]}
        rotation-x={Math.PI * 2}
        rotation-y={Math.PI}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          // side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshPhongMaterial transparent opacity={0} />            */}
        {/* <Edges color="grey" /> */}
        {/* <meshPhongMaterial side={THREE.DoubleSide} /> */}
      </mesh>

      {/* wall (back wall with wood texture, facing the camera on initial load) */}
      <mesh
        receiveShadow
        position={[0, 35, -65]}
        rotation-x={-Math.PI}
        rotation-y={Math.PI}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          // side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshPhongMaterial transparent opacity={0} />            */}
        {/* <Edges color="grey" /> */}
        {/* <meshPhongMaterial side={THREE.DoubleSide} /> */}
      </mesh>

      {/* wall (left side wall) */}
      <mesh
        receiveShadow
        position={[-65, 35, 0]}
        rotation-x={-Math.PI}
        rotation-y={Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial {...tilesTravertineMaterial} />
        {/* <meshPhongMaterial transparent opacity={0} /> */}
        {/* <Edges color="grey" /> */}
        {/* <meshPhongMaterial transparent opacity={0.1} side={THREE.DoubleSide} /> */}
      </mesh>

      {/* wall (right side wall) */}
      <mesh
        receiveShadow
        position={[65, 35, 0]}
        rotation-x={-Math.PI}
        rotation-y={-Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          // side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshPhongMaterial transparent opacity={0} /> */}
        {/* <Edges color="grey" /> */}
        {/* <meshPhongMaterial side={THREE.DoubleSide} /> */}
      </mesh>

      {/* floor */}
      <mesh
        receiveShadow
        position={[0, 0, 0]}
        rotation-x={-Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        {/* <circleGeometry args={[40, 128]} /> */}
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial {...concretePouredMaterial} />
        {/* <Edges
          ref={settingEdgeRef}
          scale={1}
          threshold={90}
          color="brown"
          visible={false}
        /> */}
      </mesh>

      {/* ceiling */}
      <mesh
        position={[0, 70, 0]}
        rotation-x={Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial {...tilesTravertineMaterial} />
        {/* <Edges
          ref={settingEdgeRef}
          scale={1}
          threshold={90}
          color="brown"
          visible={false}
        /> */}
        {/* <meshPhongMaterial transparent opacity={0} side={THREE.DoubleSide} /> */}
        {/* <Edges color="white" /> */}
      </mesh>

      {/* base underneath wall (left side wall) */}
      <mesh
        position={[-65, -35, 0]}
        rotation-x={-Math.PI}
        rotation-y={-Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshStandardMaterial {...tilesTravertineMaterial} /> */}
        {/* <meshPhongMaterial transparent opacity={0} /> */}
        {/* <Edges /> */}
      </mesh>

      {/* base underneath wall (right side wall) */}
      <mesh
        position={[65, -35, 0]}
        rotation-x={-Math.PI}
        rotation-y={Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshPhongMaterial transparent opacity={0} /> */}
        {/* <Edges /> */}
      </mesh>

      {/* base underneath wall (front wall, behind the camera on initial load) */}
      <mesh
        position={[0, -35, 65]}
        rotation-x={Math.PI}
        rotation-y={-Math.PI}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshPhongMaterial transparent opacity={0} /> */}
        {/* <Edges /> */}
      </mesh>

      {/* base underneath wall (back wall with wood texture, facing the camera on initial load) */}
      <mesh
        position={[0, -35, -65]}
        rotation-x={-Math.PI * 2}
        rotation-y={Math.PI}
        scale={1}
        visible={props.includeFloor}
      >
        <planeGeometry args={[130, 70]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          {...tilesTravertineMaterial}
        />
        {/* <meshPhongMaterial transparent opacity={0} /> */}
        {/* <Edges /> */}
      </mesh>

      {/* base underneath floor */}
      <mesh
        position={[0, -35, 0]}
        rotation-x={-Math.PI * 0.5}
        scale={1}
        visible={props.includeFloor}
      >
        {/* <circleGeometry args={[40, 128]} /> */}
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial {...tilesTravertineMaterial} />
        {/* <Edges
          ref={settingEdgeRef}
          scale={1}
          threshold={90}
          color="brown"
          visible={false}
        /> */}
      </mesh>

      {/* <Environment preset="dawn" /> */}
      {/* <SoftShadows size={25} samples={8} focus={0.85} /> */}
      {/* wood texture rectangle on wall for debugging */}
      {/* <mesh
        receiveShadow
        position={[0, 30, -64.9]}
        rotation-x={-Math.PI}
        rotation-y={Math.PI}
        scale={1}
        // visible={props.includeFloor}
        visible={false}
      >
        <planeGeometry args={[35, 20]} />
        <meshStandardMaterial {...woodMaterial} />
      </mesh> */}
    </>
  );
}

// const [
//   concretePlatesColorMap,
//   concretePlatesDisplacementMap,
//   concretePlatesNormalMap,
//   concretePlatesMetalnessMap,
//   concretePlatesRoughnessMap,
//   concretePlatesAoMap,
// ] = useLoader(TextureLoader, [
//   "./ConcretePrecastPlates004/ConcretePrecastPlates004_COL_2K_METALNESS.png",
//   "./ConcretePrecastPlates004/ConcretePrecastPlates004_DISP_2K_METALNESS.png",
//   "./ConcretePrecastPlates004/ConcretePrecastPlates004_NRM_2K_METALNESS.png",
//   "./ConcretePrecastPlates004/ConcretePrecastPlates004_METALNESS_2K_METALNESS.png",
//   "./ConcretePrecastPlates004/ConcretePrecastPlates004_ROUGHNESS_2K_METALNESS.png",
//   "./ConcretePrecastPlates004/ConcretePrecastPlates004_AO_2K_METALNESS.png",
// ]);

// const [
//   bricksWhitewashedColorMap,
//   bricksWhitewashedDisplacementMap,
//   bricksWhitewashedNormalMap,
//   bricksWhitewashedMetalnessMap,
//   bricksWhitewashedRoughnessMap,
//   bricksWhitewashedAoMap,
// ] = useLoader(TextureLoader, [
//   "./BricksReclaimedWhitewashedOffset001/BricksReclaimedWhitewashedOffset001_COL_2K_METALNESS.png",
//   "./BricksReclaimedWhitewashedOffset001/BricksReclaimedWhitewashedOffset001_DISP_2K_METALNESS.png",
//   "./BricksReclaimedWhitewashedOffset001/BricksReclaimedWhitewashedOffset001_NRM_2K_METALNESS.png",
//   "./BricksReclaimedWhitewashedOffset001/BricksReclaimedWhitewashedOffset001_METALNESS_2K_METALNESS.png",
//   "./BricksReclaimedWhitewashedOffset001/BricksReclaimedWhitewashedOffset001_ROUGHNESS_2K_METALNESS.png",
//   "./BricksReclaimedWhitewashedOffset001/BricksReclaimedWhitewashedOffset001_AO_2K_METALNESS.png",
// ]);
// const [
//   ceramicPlainWhiteColorMap,
//   ceramicPlainWhiteDisplacementMap,
//   ceramicPlainWhiteNormalMap,
//   ceramicPlainWhiteMetalnessMap,
//   ceramicPlainWhiteRoughnessMap,
// ] = useLoader(TextureLoader, [
//   "./CeramicPlainWhite001/CeramicPlainWhite001_COL_2K.jpg",
//   "./CeramicPlainWhite001/CeramicPlainWhite001_DISP_2K.jpg",
//   "./CeramicPlainWhite001/CeramicPlainWhite001_NRM_2K.png",
//   "./CeramicPlainWhite001/CeramicPlainWhite001_REFL_2K.jpg",
//   "./CeramicPlainWhite001/CeramicPlainWhite001_GLOSS_2K.jpg",
// ]);

// const [
//   wallColorMap,
//   wallDisplacementMap,
//   wallNormalMap,
//   wallMetalnessMap,
//   wallRoughnessMap,
//   // wallAoMap,
// ] = useLoader(TextureLoader, [
//   "./PlasterPlain001/PlasterPlain001_COL_1K_METALNESS.png",
//   "./PlasterPlain001/PlasterPlain001_DISP_1K_METALNESS.png",
//   "./PlasterPlain001/PlasterPlain001_NRM_1K_METALNESS.png",
//   "./PlasterPlain001/PlasterPlain001_METALNESS_1K_METALNESS.png",
//   "./PlasterPlain001/PlasterPlain001_ROUGHNESS_1K_METALNESS.png",
//   // "./PlasterPlain001/PlasterPlain001_BUMP_1K_METALNESS.png",
// ]);

// const [
//   planksColorMap,
//   planksDisplacementMap,
//   planksNormalMap,
//   planksMetalnessMap,
//   // planksRoughnessMap,
//   planksAoMap,
// ] = useLoader(TextureLoader, [
//   "./WoodPlanksWorn001/WoodPlanksWorn001_COL_2K.jpg",
//   "./WoodPlanksWorn001/WoodPlanksWorn001_DISP_2K.jpg",
//   "./WoodPlanksWorn001/WoodPlanksWorn001_NRM_2K.jpg",
//   "./WoodPlanksWorn001/WoodPlanksWorn001_GLOSS_2K.jpg",
//   // "./WoodPlanksWorn001/WoodPlanksWorn001_ROUGHNESS_2K_METALNESS.png",
//   "./WoodPlanksWorn001/WoodPlanksWorn001_AO_2K.jpg",
// ]);

// const [
//   tilesColorMap,
//   tilesDisplacementMap,
//   tilesNormalMap,
//   tilesRoughnessMap,
// ] = useLoader(TextureLoader, [
//   "./Tiles036/Tiles036_1K_Color.jpg",
//   "./Tiles036/Tiles036_1K_Displacement.jpg",
//   "./Tiles036/Tiles036_1K_Normal.jpg",
//   "./Tiles036/Tiles036_1K_Roughness.jpg",
// ]);

// const [
//   tilesTravertineColorMap,
//   tilesTravertineDisplacementMap,
//   tilesTravertineNormalMap,
//   tilesTravertineMetalnessMap,
//   tilesTravertineRoughnessMap,
//   tilesTravertineAoMap,
// ] = useLoader(TextureLoader, [
//   "./TilesTravertine001/TilesTravertine001_COL_2K.jpg",
//   "./TilesTravertine001/TilesTravertine001_DISP_2K.jpg",
//   "./TilesTravertine001/TilesTravertine001_NRM_2K.jpg",
//   "./TilesTravertine001/TilesTravertine001_REFL_2K.jpg",
//   "./TilesTravertine001/TilesTravertine001_GLOSS_2K.jpg",
//   "./TilesTravertine001/TilesTravertine001_AO_2K.jpg",
// ]);

// const [
//   grassColorMap,
//   grassDisplacementMap,
//   grassNormalMap,
//   grassRoughnessMap,
//   grassAoMap,
// ] = useLoader(TextureLoader, [
//   "./Grass001/Grass001_1K_Color.jpg",
//   "./Grass001/Grass001_1K_Displacement.jpg",
//   "./Grass001/Grass001_1K_Normal.jpg",
//   "./Grass001/Grass001_1K_Roughness.jpg",
//   "./Grass001/Grass001_1K_AmbientOcclusion.jpg",
// ]);
// const concretePlatesMaterial = {
//   // metalness: debugControls.metalness,
//   // roughness: debugControls.roughness,
//   displacementScale: 0,
//   map: concretePlatesColorMap,
//   displacementMap: concretePlatesDisplacementMap,
//   normalMap: concretePlatesNormalMap,
//   metalnessMap: concretePlatesMetalnessMap,
//   roughnessMap: concretePlatesRoughnessMap,
//   aoMap: concretePlatesAoMap,
//   wireframe: debugControls.wireframe,
// };

// const ceramicPlainWhiteMaterial = {
//   displacementScale: 0,
//   map: ceramicPlainWhiteColorMap,
//   displacementMap: ceramicPlainWhiteDisplacementMap,
//   normalMap: ceramicPlainWhiteNormalMap,
//   metalnessMap: ceramicPlainWhiteMetalnessMap,
//   roughnessMap: ceramicPlainWhiteRoughnessMap,
//   wireframe: debugControls.wireframe,
// };

// const bricksWhitewashedMaterial = {
//   displacementScale: 0,
//   map: bricksWhitewashedColorMap,
//   displacementMap: bricksWhitewashedDisplacementMap,
//   normalMap: bricksWhitewashedNormalMap,
//   metalnessMap: bricksWhitewashedMetalnessMap,
//   roughnessMap: bricksWhitewashedRoughnessMap,
//   aoMap: bricksWhitewashedAoMap,
//   wireframe: debugControls.wireframe,
// };
// const wallMaterial = {
//   metalness: debugControls.metalness,
//   roughness: debugControls.roughness,
//   displacementScale: 0,
//   map: wallColorMap,
//   displacementMap: wallDisplacementMap,
//   normalMap: wallNormalMap,
//   metalnessMap: wallMetalnessMap,
//   roughnessMap: wallRoughnessMap,
//   // aoMap: wallAoMap,
//   wireframe: debugControls.wireframe,
// };

// const planksMaterial = {
//   metalness: debugControls.metalness,
//   roughness: debugControls.roughness,
//   displacementScale: 0,
//   map: planksColorMap,
//   displacementMap: planksDisplacementMap,
//   normalMap: planksNormalMap,
//   metalnessMap: planksMetalnessMap,
//   aoMap: planksAoMap,
//   // color: props.currentItemSelected.itemColor,
//   wireframe: debugControls.wireframe,
// };

// const tilesMaterial = {
//   displacementScale: 0,
//   map: tilesColorMap,
//   displacementMap: tilesDisplacementMap,
//   normalMap: tilesNormalMap,
//   roughnessMap: tilesRoughnessMap,
//   wireframe: debugControls.wireframe,
// };

// const grassMaterial = {
//   displacementScale: 0,
//   map: grassColorMap,
//   displacementMap: grassDisplacementMap,
//   normalMap: grassNormalMap,
//   roughnessMap: grassRoughnessMap,
//   aoMap: grassAoMap,
//   wireframe: debugControls.wireframe,
// };

// wood texture for sorting best texture variation in development
// const [
//   colorMap,
//   displacementMap,
//   normalMap,
//   metalnessMap,
//   roughnessMap,
//   aoMap,
// ] = useTexture(props.currentItemSelected.itemTexture);

// const tilesTravertineMaterial = {
//   // metalness: debugControls.metalness,
//   // roughness: debugControls.roughness,
//   displacementScale: 0,
//   map: tilesTravertineColorMap,
//   displacementMap: tilesTravertineDisplacementMap,
//   normalMap: tilesTravertineNormalMap,
//   metalnessMap: tilesTravertineMetalnessMap,
//   roughnessMap: tilesTravertineRoughnessMap,
//   aoMap: tilesTravertineAoMap,
//   wireframe: debugControls.wireframe,
// };