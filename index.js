window.addEventListener("DOMContentLoaded", init);
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
var dog_speed = 1;
const func = function changeDogSpeed(e) {
  dog_speed = e.target.value;
};
const target = document.getElementById("dog_speed");
target.addEventListener("change", func);

function init() {
  const width = 800;
  const height = 800;
  //   １レンダラーを作る
  //   画面上に描画するやつ
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color("white")); //背景色の設定
  renderer.shadowMap.enabled = true;
  //   ２シーンを作る
  //   オブジェクトや光源の置き場所
  const scene = new THREE.Scene();

  //   ３カメラを作る
  //   その視点から見える物がレンダラーを介してcanvasへ描画される
  //   new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
  camera.position.set(5000, 10000, 20000);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  //   ４立方体を作る
  //   立方体はメッシュという表示オブジェクトを使用して作成する。
  //   メッシュを作るには、ジオメトリ(形状)とマテリアル(素材)を用意
  //   new THREE.BocGeomertry(幅, 高さ, 奥行き)
  const geomerty = new THREE.TorusGeometry(2000, 200, 64, 200);
  //   素材を選択
  const material = new THREE.MeshStandardMaterial({
    color: 0x6699ff,
    roughness: 0.5,
  });
  //   new THREE.Mesh(ジオメトリ, マテリアル)
  const torus = new THREE.Mesh(geomerty, material);
  torus.castShadow = true;
  // torus.rotation.y = Math.Pi / 2;
  //   シーンに追加
  scene.add(torus);

  //   4+α　Blenderで作ったモデルを読み込む
  const loader = new GLTFLoader();
  const url = "./NEWOPEN.glb";

  const wrap = new THREE.Group();

  let model = null;
  loader.load(
    url,
    function (gltf) {
      //すべてのメッシュ(物体)にcastShadow(影を発生させる設定)を適用する
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
        }
      });
      model = gltf.scene;
      model.scale.set(200.0, 200.0, 200.0);
      model.position.set(-4000, 500, 7000);
      model.rotation.set(0, Math.PI / 2.5, 0);
      wrap.add(model);
    },
    function (error) {
      console.log(error);
    }
  );

  let model2 = null;
  loader.load(
    url,
    function (gltf) {
      //すべてのメッシュ(物体)にcastShadow(影を発生させる設定)を適用する
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
        }
      });
      model2 = gltf.scene;
      model2.scale.set(200.0, 200.0, 200.0);
      model2.position.set(1000, 500, 8000);
      model2.rotation.set(0, Math.PI / 2, 0);
      wrap.add(model2);
    },
    function (error) {
      console.log(error);
    }
  );
  scene.add(wrap);

  //4+β 床を作成
  const meshFloor = new THREE.Mesh(
    new THREE.BoxGeometry(40000, 0.1, 40000),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  );
  //4+β 床に影を受け付けるようにする
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  //   ５ライトを作る
  //   new THREE.DirectionalLight(色)
  // const light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(1, 1, 1);
  // light.intensity = 2;

  const light2 = new THREE.AmbientLight(0xa9a9a9);
  scene.add(light2);

  //   5+α スポットライトを作る
  // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
  const light = new THREE.SpotLight(0xffffff, 2, 40000, Math.PI / 4, 1);
  light.position.set(3000, 4000, 3000);
  //   ライトに影を有効にする
  light.castShadow = true;
  light.shadow.mapSize.width = 2024;
  light.shadow.mapSize.height = 2024;

  // ヘルパーを作成
  const lightHelper = new THREE.SpotLightHelper(light);
  scene.add(lightHelper);
  var grid = new THREE.GridHelper(40000, 100, 0x808080, 0x808080);
  grid.position.set(0, 0, 0);
  scene.add(grid);

  //   シーンに追加
  scene.add(light);
  // scene.add(light2);

  //   ６描画する
  renderer.render(scene, camera);

  //   ７アニメーション
  //   requestAnimationFrame()というjavascriptにあるグローバルメソッドを利用する。
  //   引数で関数を渡すと、毎フレーム実行してくれる。
  tick();

  function tick() {
    requestAnimationFrame(tick);

    // //   犬達のグループを回転させる
    wrap.rotation.y += dog_speed / 100;

    //   レンダリング
    renderer.render(scene, camera);
  }
}
