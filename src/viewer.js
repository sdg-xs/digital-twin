import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {FragmentsModels,RenderedFaces} from '@thatopen/fragments';

// That Open owns BIM loading, worker culling, picking, visibility and highlighting.
// Three.js owns the scene, camera, lighting, renderer and clipping plane.
export async function createViewer(container,{onSelect,onProgress}){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#edf2f8');
 const camera=new THREE.PerspectiveCamera(42,1,.1,3000);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.localClippingEnabled=true;renderer.clippingPlanes=[];container.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.12;controls.maxPolarAngle=Math.PI*.95;
 scene.add(new THREE.HemisphereLight(0xffffff,0x8f9caa,2.5));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(60,100,70);scene.add(light);
 const engine=new FragmentsModels(new URL(import.meta.env.BASE_URL+'engine/worker.mjs',document.baseURI).href,{maxWorkers:2});engine.settings.graphicsQuality=.65;
 let disposed=false,model=null,box=null,clipping=null,lastSelected=null;
 const resize=()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(container);resize();
 renderer.setAnimationLoop(()=>{if(disposed)return;controls.update();renderer.render(scene,camera)});
 const fit=(target=box,top=false)=>{if(!target||target.isEmpty())return;const center=target.getCenter(new THREE.Vector3()),size=target.getSize(new THREE.Vector3());let distance=Math.max(size.x,size.y,size.z,2)*.72/Math.tan(camera.fov*Math.PI/360);distance/=Math.min(1,camera.aspect);controls.target.copy(center);camera.position.copy(center).add((top?new THREE.Vector3(.001,1,.001):new THREE.Vector3(.9,.65,1)).normalize().multiplyScalar(distance));camera.near=Math.max(.01,distance/10000);camera.far=Math.max(2000,distance*20);camera.updateProjectionMatrix();controls.update();engine.update(true)};
 let down=null;const pointerDown=e=>{down=[e.clientX,e.clientY]};const pointerUp=async e=>{if(!model||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;try{const hit=await model.raycast({camera,mouse:new THREE.Vector2(e.clientX,e.clientY),dom:renderer.domElement});if(hit)onSelect(hit.localId)}catch(err){console.error('Model picking failed',err)}};
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);controls.addEventListener('end',()=>engine.update(true));
 const api={
  async select(id){if(!model)return;await model.resetColor(undefined);if(id!=null)await model.setColor([id],new THREE.Color('#1769e0'));lastSelected=id;await engine.update(true)},
  async filter(ids){if(!model)return;if(ids===null)await model.resetVisible();else {await model.setVisible(undefined,false);await model.setVisible(ids,true)}await engine.update(true)},
  async isolate(id){if(!model)return;await model.setVisible(undefined,false);await model.setVisible([id],true);fit(await model.getMergedBox([id]))},
  async focus(id){if(!model)return;fit(await model.getMergedBox([id]))},
  fit(top=false){fit(box,top)},
  zoom(factor){camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);controls.update();engine.update(true)},
  async section(enabled,value){if(!model||!box)return;const height=box.min.y+(box.max.y-box.min.y)*value/100;renderer.clippingPlanes.length=0;if(enabled){clipping=new THREE.Plane(new THREE.Vector3(0,-1,0),height);renderer.clippingPlanes.push(clipping)}model.useClippingPlanes(renderer.clippingPlanes);await engine.update(true)},
  async opacity(value){if(!model)return;await model.setOpacity(undefined,value/100);await engine.update(true)},
  async properties(id){return model?model.getItemsData([id],{attributesDefault:true}):[]},
  async dispose(){disposed=true;observer.disconnect();renderer.setAnimationLoop(null);controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',pointerUp);await engine.dispose();renderer.dispose();renderer.domElement.remove()},
 };
 try{onProgress('Loading SOL10 model…');const response=await fetch(import.meta.env.BASE_URL+'models/SOL10.frag');if(!response.ok)throw Error('SOL10 model file could not be loaded');const bytes=await response.arrayBuffer();onProgress('Preparing BIM geometry…');model=await engine.load(bytes,{modelId:'SOL10',camera,clippingPlanes:renderer.clippingPlanes});if(disposed){await engine.dispose();return api}scene.add(model.object);box=model.box.clone();fit();await engine.update(true);onProgress('ready');return api}catch(e){await api.dispose();throw e}
}
