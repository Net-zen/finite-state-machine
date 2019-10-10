class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        // this._activeState = config.initial;
        this._config = config;
        this._stateStack = [];
        this._undoStack = [];
        this._stateStack.push(config.initial);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return (this._stateStack.length) ? this._stateStack[this._stateStack.length - 1] : null;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this._config.states[state] !== undefined){
            if (this.getState() !== state) {
                this._stateStack.push(state);
            }
        } else {
            throw new Error('State isn\'t exist');
        }
        
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (this._config.states[this._stateStack[this._stateStack.length-1]].transitions[event] !== undefined ) {
            this._stateStack.push(this._config.states[this._stateStack[this._stateStack.length-1]].transitions[event]);
            this._undoStack = [];
        } else {
            throw new Error('Event in current state isn\'t exist');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._stateStack = [this._config.initial];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event === undefined) {
            return  Object.keys(this._config.states);
        } else if (event === ''){
            return [];
        } else {
            let eventStates = [];
            for (const state in this._config.states) {
                if (this._config.states.hasOwnProperty(state)) {
                    if (this._config.states[state].transitions.hasOwnProperty(event)){
                    eventStates.push(state);
                    }
                }
            }
            return eventStates;
        }
       
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._stateStack.length > 1) {
            this._undoStack.push(this._stateStack.pop());
            return true
        } else {
            return false
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this._undoStack.length) {
            return false
        } else {
            this._stateStack.push(this._undoStack.pop());
            return true
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._undoStack = [];
        this._stateStack = [this._stateStack[this._stateStack.length-1]];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
