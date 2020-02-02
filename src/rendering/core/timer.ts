export class Timer {

  delta = 0;
  lastTick = Date.now();

  tick() {
    const timeNow = Date.now();
    this.delta = Date.now() - this.lastTick;
    this.lastTick = timeNow;
    return this.getDelta();
  }

  getDelta() {
    return this.delta;
  }
}
