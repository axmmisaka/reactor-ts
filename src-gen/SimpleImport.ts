import {Variable, Priority, VarList, Mutations, Util, Readable, Schedulable, Writable, Named, Reaction, Deadline, Action, Startup, Scheduler, Timer, Reactor, Port, OutPort, InPort, App } from "./reactor";
import {TimeUnit,TimeInterval, UnitBasedTimeInterval, TimeInstant, Origin, getCurrentPhysicalTime } from "./time"
// Code generated by the Lingua Franca compiler for reactor HelloWorldInside in SimpleImport
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

// Code generated by the Lingua Franca compiler for reactor SimpleImport in SimpleImport
// =============== START reactor class SimpleImport
class SimpleImport extends App {
    a: HelloWorldInside
    b: HelloWorldInside
    constructor(name: string, timeout: TimeInterval | null, success?: ()=> void, fail?: ()=>void) {
        super(timeout, success, fail);
        this.a = new HelloWorldInside(this)
        this.b = new HelloWorldInside(this)
    }
}
// =============== END reactor class SimpleImport

// ************* Instance SimpleImport of class SimpleImport
let _app = new SimpleImport('SimpleImport', null)
// ************* Starting Runtime for SimpleImport of class SimpleImport
_app._start();
