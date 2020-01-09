import {Variable, Priority, VarList, Mutations, Util, Readable, Schedulable, Writable, Named, Reaction, Deadline, Action, Startup, Scheduler, Timer, Reactor, Port, OutPort, InPort, App } from "./reactor";
import {TimeUnit,TimeInterval, UnitBasedTimeInterval, TimeInstant, Origin, getCurrentPhysicalTime } from "./time"
// Code generated by the Lingua Franca compiler for reactor HelloWorldInside in HelloWorld
// =============== START reactor class HelloWorldInside
class HelloWorldInside extends Reactor {
    t: Timer;
    constructor(parent:Reactor) {
        super(parent);
        this.t = new Timer(this, 0, 0);
        this.addReaction(new class<T> extends Reaction<T> {
            //@ts-ignore
            react() {
                var self = this.parent as HelloWorldInside;
                console.log("Hello World.");
            }
        }(this, this.check(this.t, ), this.check()));
    }
}
// =============== END reactor class HelloWorldInside

// Code generated by the Lingua Franca compiler for reactor HelloWorld in HelloWorld
// =============== START reactor class HelloWorld
class HelloWorld extends App {
    a: HelloWorldInside
    constructor(name: string, timeout: TimeInterval | null, success?: ()=> void, fail?: ()=>void) {
        super(timeout, success, fail);
        this.a = new HelloWorldInside(this)
    }
}
// =============== END reactor class HelloWorld

// ************* Instance HelloWorld of class HelloWorld
let _app = new HelloWorld('HelloWorld', null)
// ************* Starting Runtime for HelloWorld of class HelloWorld
_app._start();
