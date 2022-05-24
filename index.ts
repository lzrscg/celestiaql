import History from "./history";

async function run() {
  const history = new History();

  await history.syncFrom(2407,2407);

  console.log("Done");
}
run();
