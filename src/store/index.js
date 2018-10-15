import React from "react";
const Context = React.createContext();

function store(Components) {
    return function Consumer(props) {
        return (
            <Context.Consumer>
                {(stores) => <Components store={stores} {...props} />}
            </Context.Consumer>
        );
    };
}

export { Context, store };
