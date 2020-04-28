import {Reactor, Reaction, Priority, App, Triggers, InPort, Args, ArgList, Startup, Shutdown, CalleePort, CallerPort, Port, Present, OutPort} from '../src/core/reactor';
import { UnitBasedTimeValue, TimeUnit, TimeValue } from '../src/core/time';
import { Log, LogLevel, PrecedenceGraph, PrecedenceGraphNode } from '../src/core/util';
import { doesNotMatch } from 'assert';

/* Set a port in startup to get thing going */
class Starter extends Reactor {
    public out = new OutPort<number>(this);

    constructor(parent: Reactor|null) {
        super(parent);
        this.addReaction(
            new Triggers(this.startup),
            new Args(this.getWriter(this.out)),
            function(this, __out) {
                __out.set(4);

            }
        );
    }

}

/* A reactor with a deadline in its constructor */
class R1 extends Reactor {
    public in = new InPort<number>(this);
    public out = new OutPort<number>(this);

    constructor(parent: Reactor|null, deadline: TimeValue) {
        super(parent);
        this.addReaction(
            new Triggers(this.in),
            new Args(this.in, this.getWriter(this.out)),
            function(this, __in, __out) {
                const util = this.util
                let initialElapsedTime = util.getElapsedPhysicalTime();
                let tmp = __in.get();
                
                if(tmp)
                {
                    console.log("Recieved "+tmp.toString());
                }

                let out: number = 0;

                try {
                    if(tmp)
                    {
                        out = tmp + 4;
                        while (util.getElapsedPhysicalTime().isEarlierThan(initialElapsedTime.add(new UnitBasedTimeValue(1, TimeUnit.sec))));
                    }
                } finally {
                    if(out){
                        console.log("Sending "+out.toString())
                        __out.set(out);
                    }
                }

            },
            deadline


        );
    }



}

class R2 extends Reactor {
    public in = new InPort<number>(this);

    constructor(parent: Reactor|null) {
        super(parent);
        this.addReaction(
            new Triggers(this.in),
            new Args(this.in),
            function(this, __in) {
                let tmp = __in.get();
                /* Do Nothing */               
                if(tmp)
                {
                    console.log("Recieved "+tmp.toString());
                }
            }

        );
    }

}

class testApp extends App {
    start: Starter
    reactor1: R1;
    reactor2: R2;

    constructor (name: string, timeout: TimeValue, success?: () => void, fail?: () => void) {
        super(timeout, false, false, success, fail);
        this.start = new Starter(this);
        this.reactor1 = new R1(this, timeout);
        this.reactor2 = new R2(this);
        this._connect(this.start.out, this.reactor1.in)
        this._connect(this.reactor1.out, this.reactor2.in)
    }
}



describe("Testing deadlines", function () {

    jest.setTimeout(7000);

    it("Missed reaction deadline on InPort", done => {

        function fail() {
            throw new Error("Test has failed.");
        };

        let app = new testApp("testApp", new TimeValue(1,TimeUnit.msec), done, fail)

        //spyOn(app, '_start').and.callThrough

        //expect(() => {app._start()}).toThrowError("Deadline violation occurred!");

        /* FIXME: Deadlines are not working */
        app._start();
    });


});



