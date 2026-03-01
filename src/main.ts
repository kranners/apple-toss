import { Application, Assets, Sprite } from "pixi.js";

const FORCE_MULTIPLIER = 100000.0;

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });

  const pixiContainer = document.getElementById("pixi-container")!;
  pixiContainer.appendChild(app.canvas);

  const RAPIER = await import("@dimforge/rapier2d");
  const world = new RAPIER.World({ x: 0.0, y: 9.81 });

  const bunnyTexture = await Assets.load("/assets/bunny.png");
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

  app.canvas.onpointerdown = (event: PointerEvent) => {
    const launchAngleRadians = Math.atan2(
      event.clientY - bunnySprite.y,
      event.clientX - bunnySprite.x,
    );

    const launchForceX = FORCE_MULTIPLIER * Math.cos(launchAngleRadians);
    const launchForceY = FORCE_MULTIPLIER * Math.sin(launchAngleRadians);

    bunnyRigidBody.applyImpulse({ x: launchForceX, y: launchForceY }, true);
    bunnyRigidBody.applyTorqueImpulse(launchForceX * 2, true);
  };

  // Listen for animate update
  app.ticker.add(() => {
    world.step();
    bunnySprite.position = bunnyRigidBody.translation();
    bunnySprite.rotation = bunnyRigidBody.rotation();
  });
})();
