import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { capitalize, allCaps } from "@workspace/textparser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4444);
  const data = capitalize("hello world");
  const data1 = allCaps("hello world");

  console.log(data, data1);
  console.log("App is running: http://localhost:4444");
}
bootstrap();
