import Matter from 'matter-js';

export class GameObject {
  public body: Matter.Body;
  
  constructor(body: Matter.Body) {
    this.body = body;
  }
}
