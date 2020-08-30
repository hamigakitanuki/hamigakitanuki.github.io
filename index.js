window.addEventListener("DOMContentLoaded", init);
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";

function init() {
  const width = 500;
  const height = 500;

  //   １レンダラーを作る
  //   画面上に描画するやつ
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  //   ２シーンを作る
  //   オブジェクトや光源の置き場所
  const scene = new THREE.Scene();

  //   ３カメラを作る
  //   その視点から見える物がレンダラーを介してcanvasへ描画される
  //   new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, 1500);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  //   ４立方体を作る
  //   立方体はメッシュという表示オブジェクトを使用して作成する。
  //   メッシュを作るには、ジオメトリ(形状)とマテリアル(素材)を用意
  //   new THREE.BocGeomertry(幅, 高さ, 奥行き)
  // const geomerty = new THREE.TorusGeometry(300, 100, 64, 100);
  // //   素材を選択
  // const material = new THREE.MeshStandardMaterial({
  //   color: 0x6699ff,
  //   roughness: 0.5,
  // });
  // //   new THREE.Mesh(ジオメトリ, マテリアル)
  // const box = new THREE.Mesh(geomerty, material);
  // //   シーンに追加
  // scene.add(box);

  //   4+α　Blenderで作ったモデルを読み込む
  const loader = new GLTFLoader();
  const url = "http://192.168.43.75:8080/NEWOPEN.glb";

  let model = null;
  loader.load(
    url,
    function (gltf) {
      model = gltf.scene;
      model.scale.set(200.0, 200.0, 200.0);
      model.position.set(0, 0, 0);
      scene.add(gltf.scene);
    },
    function (error) {
      console.log(error);
    }
  );

  //   ５ライトを作る
  //   new THREE.DirectionalLight(色)
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  //   光の強さを倍に
  light.intensity = 2;

  const light2 = new THREE.DirectionalLight(0xffffff);
  light2.position.set(-1, -1, -1);
  //   光の強さを倍に
  light2.intensity = 2;

  //   シーンに追加
  scene.add(light);
  scene.add(light2);

  //   ６描画する
  renderer.render(scene, camera);

  //   ７アニメーション
  //   requestAnimationFrame()というjavascriptにあるグローバルメソッドを利用する。
  //   引数で関数を渡すと、毎フレーム実行してくれる。
  tick();

  function tick() {
    requestAnimationFrame(tick);

    // //   箱を回転させる
    // box.rotation.y += 0.01;
    // box.rotation.x += 0.01;

    //   レンダリング
    renderer.render(scene, camera);
  }
}
