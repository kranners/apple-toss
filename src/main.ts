import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  const pixiContainer = document.getElementById("pixi-container")!;
  pixiContainer.appendChild(app.canvas);

  const RAPIER = await import("@dimforge/rapier2d");
  const world = new RAPIER.World({ x: 0.0, y: 9.81 });

  // Load the bunny texture
  const bunnyTexture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  const bunnySprite = new Sprite(bunnyTexture);
  bunnySprite.anchor.set(0.5);
  bunnySprite.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(bunnySprite);

  const bunnyRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    bunnySprite.x,
    bunnySprite.y,
  );

  const bunnyRigidBody = world.createRigidBody(bunnyRigidBodyDesc);

  const bunnyColliderDesc = RAPIER.ColliderDesc.cuboid(
    bunnySprite.width / 2,
    bunnySprite.height / 2,
  );

  world.createCollider(bunnyColliderDesc, bunnyRigidBody);

  // Listen for animate update
  app.ticker.add(() => {
    world.step();
    // bunnyRigidBody.addForce({ x: 0.0, y: -0.5 }, true);
    bunnySprite.position = bunnyRigidBody.translation();
    bunnySprite.rotation = bunnyRigidBody.rotation();
  });
})();
