//@flow
import {Actor, InputPort, OutputPort, Component, Composite, Parameter} from "./hierarchy";
import {DiscreteEvents} from "./discrete-events";

describe('ports', () => {
    let actor = new Actor("component");
    
    it('basic add and get', () => {
        actor.add(new InputPort("in"));
        actor.add(new OutputPort("out"));
        actor.add(new Parameter("parm"));

        var port = actor.find("in");
        expect(port != null).toBeTruthy();
        expect(port instanceof InputPort).toBeTruthy();

        var port = actor.find("out");
        expect(port != null).toBeTruthy();
        expect(port instanceof OutputPort).toBeTruthy();

        var port = actor.find("parm");
        expect(port != null).toBeTruthy();
        expect(port instanceof Parameter).toBeTruthy();

    });

    actor = new Actor("component");
    
    it('add using constructor', () => {
        new InputPort("in", actor);
        new OutputPort("out", actor);
        new Parameter("parm", actor);

        var port = actor.find("in");
        expect(port != null).toBeTruthy();
        expect(port instanceof InputPort).toBeTruthy();

        var port = actor.find("out");
        expect(port != null).toBeTruthy();
        expect(port instanceof OutputPort).toBeTruthy();

        var port = actor.find("parm");
        expect(port != null).toBeTruthy();
        expect(port instanceof Parameter).toBeTruthy();

    });

    it('no random port', () => {
        var port = actor.find("random");
        expect(port).toBe(undefined);
    });
    
});

describe('composite', () => {
    let topLevel = new Composite("topLevel");
    let composite = new Composite("composite");
    let component = new Component("component");

    it('compose hierarchy', () => {
        topLevel.add(composite);
        composite.add(component);
        expect(composite.parent).toBe(topLevel);
        expect(component.parent).toBe(composite);
    });

    it('compose hierarchy using constructor', () => {
        topLevel.remove("composite");
        composite.remove("component");
        let composite2 = new Composite("composite2", topLevel);
        let component2 = new Component("component2", composite2);
        expect(composite2.parent).toBe(topLevel);
        expect(component2.parent).toBe(composite2);

    });

    it('qualified names in hierarchy chain', () => {
        expect(component.getFullyQualifiedName()).toBe("topLevel.composite.component");
    });

    it('add/remove component', () => {
        let component = new Component("new-component");
        topLevel.add(component);
        expect(component.getFullyQualifiedName()).toBe("topLevel.new-component");

        topLevel.remove(component);
        expect(topLevel.find(component.name)).toBeUndefined();
    });

    it('director check', () => {
        expect(() => {
            topLevel.initialize()
        }).toThrowError("Top-level container must have a director");
    });
});

// FIXME: this exercises director more than hierarchy; move these tests
describe('connect', () => {
    let topLevel = new Composite("topLevel");
    let composite = new Composite("composite");
    let component = new Component("component");
    let director = new DiscreteEvents();
    topLevel.setDirector(director);
    topLevel.add(composite);
    composite.add(component);

    let input = new InputPort("in");
    let output = new OutputPort("out");

    it('toplevel to self', () => {
        topLevel.add(input);
        topLevel.add(output);
        expect(() => {director.connect(output, input)}).toThrowError("Self-loops are not allowed in top-level.");
        let rel = director.connect(input, output);
        expect(rel.name).toBe("in->out");
        expect(topLevel.findRelation(rel.name)).toBe(rel);
    });           

    it('composite to self', () => {
        composite.add(input);
        composite.add(output);
        let rel = director.connect(output, input);
        expect(rel.name).toBe("out->in");
        expect(composite.findRelation(rel.name)).toBe(rel);
        rel = director.connect(input, output);
        expect(rel.name).toBe("in->out");
        expect(composite.findRelation(rel.name)).toBe(rel);
    });

    it('actor to self', () => {
        let component = new Actor("component", composite);
        component.add(input);
        component.add(output);
        let rel = director.connect(output, input);
        expect(rel.name).toBe("out->in(1)");
        expect(composite.findRelation(rel.name)).toBe(rel);
        expect( () => {director.connect(input, output)}).toThrowError("Cannot connect input to output on the same actor.");
        expect( () => {director.connect(output, output)}).toThrowError("Cannot connect output to output on the same actor.");
        expect( () => {director.connect(input, input)}).toThrowError("Cannot connect input to input on the same actor.");
    });

    it('actor no parent', () => {
        let component = new Actor("component");
        component.add(input);
        component.add(output);
        expect(() => {director.connect(output, input)}).toThrowError("No composite available to store relation.");
    });


    // More to follow...
});
