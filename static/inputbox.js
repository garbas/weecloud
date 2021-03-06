if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
  'react'
], function(React, undefined) {

  var InputBox = React.createClass({
      // Handles input to weechat with additional features:
      // - caseinsensitive autocomplete by nickname list (tab to advance, shift-tab to reverse)
      // TODO: - autocomplete irc commands
      // TODO: use filter function to implement cycling of nicknames on autocompletion
      // TODO: autocomplete sort should obey history of the channel as the list of nicknames
      
    displayName: 'App',

    getInitialState: function() {
      return {value: ""};
    },
    
    handleInput: function (e) {
      if (e.keyCode === 9) { // tab
          var words = e.target.value.trim().split(" "),
              maybeNick = this.state.autocompleteNick || words.slice(-1)[0],
              currentNick = words.slice(-1)[0],
              leftWords = words.slice(0, -1),
              // support tab+shift to reverse search
              nicknameList = e.shiftKey ? this.props.nicklist.slice(0).reverse() : this.props.nicklist,
              currentNickIndex = nicknameList.indexOf(currentNick);
          
          var reduceNicks = function (prevVal, nextVal, index) {
              // if nickname beings with input text
              if (index > currentNickIndex && nextVal.toLowerCase().lastIndexOf(maybeNick.toLowerCase(), 0) === 0 && currentNick === prevVal) {
                return nextVal;
              } else {
                return prevVal;
              }
          };
  
          leftWords.push(nicknameList.reduce(reduceNicks, currentNick));
          
          this.setState({value: leftWords.join(" "),
                         autocompleteNick: maybeNick});
          e.preventDefault();
      } else if (e.keyCode === 13 ) { // enter
         this.handleEnter();   
      }
    },
    handleEnter: function () {
      this.props.handleSubmit(this.state.value);
      this.setState({value: ""});
    },
    handleChange: function (e) {
      this.setState({value: e.target.value,
                     autocompleteNick: ""});
    },
    render: function() {
      var layout = this.props.layout.bufferInput || {};
      return (React.DOM.div({className: "input-group", style: layout.wrapper || {}}, [
        React.DOM.input({key: "input",
                         style: layout.input || {},
                         className: "form-control buffer-input",
                         placeholder: "<type something here>",
                         type: "text",
                         value: this.state.value,
                         onChange: this.handleChange,
                         onKeyDown: this.handleInput}),
        React.DOM.span({key: "submit",
                        className: "input-group-btn"},
          React.DOM.button({className: "btn btn-primary",
                            type: "button",
                            style: layout.button || {},
                            onClick: this.handleEnter}, "Send"))
      ]))
    }
  });

  return InputBox;

});
