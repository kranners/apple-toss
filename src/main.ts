import Matter from "matter-js";
import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  const pixiContainer = document.getElementById("pixi-container")!;
  pixiContainer.appendChild(app.canvas);

  const engine = Matter.Engine.create();

  const wallTop = Matter.Bodies.rectangle(
    app.screen.width / 2,
    0,
    app.screen.width,
    10,
    {
      isStatic: true,
    },
  );

  const wallBottom = Matter.Bodies.rectangle(
    app.screen.width / 2,
    app.screen.height,
    app.screen.width,
    10,
    {
      isStatic: true,
    },
  );

  const wallRight = Matter.Bodies.rectangle(
    app.screen.width,
    app.screen.height / 2,
    10,
    app.screen.height,
    {
      isStatic: true,
    },
  );

  const wallLeft = Matter.Bodies.rectangle(
    0,
    app.screen.height / 2,
    10,
    app.screen.height,
    {
      isStatic: true,
    },
  );

  Matter.World.add(engine.world, [wallTop, wallBottom, wallRight, wallLeft]);

  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(app.canvas),
    constraint: {
      render: { visible: true },
    },
  });

  Matter.World.add(engine.world, mouseConstraint);

  // Load the bunny texture
  const bunnyTexture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  const bunnySprite = new Sprite(bunnyTexture);
  bunnySprite.anchor.set(0.5);
  bunnySprite.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(bunnySprite);

  const bunnyBody = Matter.Bodies.rectangle(
    bunnySprite.x,
    bunnySprite.y,
    bunnySprite.width,
    bunnySprite.height,
    { restitution: 0.8 },
  );

  Matter.World.addBody(engine.world, bunnyBody);

  // Listen for animate update
  app.ticker.add(() => {
    bunnySprite.position = bunnyBody.position;
    bunnySprite.rotation = bunnyBody.angle;
  });

  Matter.Runner.run(engine);
})();
