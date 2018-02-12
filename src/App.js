import './App.css';
import data from './data/hierarchy.json';

import React,{ Component } from 'react';

class App extends Component {
    render() {
        return ( <
            Dashboard / >
        );
    }
}

class Navpad extends React.Component {

  scrollTree = (e) => {
    window.scrollBy((-50+e.clientX)*10,(-700+e.clientY)*10)
  }

  render() {
    return (
        <div className="nav-pad" onMouseMove={this.scrollTree}></div>
    );
  }
}

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	visible: false,
      childCount:0,
      points:"0,0",
      config: props.node
    };
  }

  toggle = () => {
    this.setState({visible: !this.state.visible});

    if(this.props.node.children.length && this.props.node.parent){
        if(!this.state.visible){
          this.setState({points:"12,0 12,120"});
        } else {
          this.setState({points:"12,0 12,75"});
        }
    } else if(!this.props.node.parent){
      if(!this.state.visible){
        this.setState({points:"12,75 12,120"})
      } else {
        this.setState({points:"0,0"})
      }
    } else {
      this.setState({points:"12,0 12,75"});
    }
  }

  addChild = (e) => {
    var config = this.state.config;
    config.children.push({'name':config.name+(config.children.length+1),"children":[]})
    this.setState({config:config})
    this.props.node.childCount += 1;
    if(this.props.node.bubbleChange)
      this.props.node.bubbleChange();
  }

  componentWillMount() {
    this.setState({childCount:1});
    var count = 1;
    this.props.node.children.map((node,index)=>{
      count+=node.childCount;
    })

    this.setState({childCount:count});

    if(this.props.node.bubbleChange){
      this.props.node.bubbleChange();
    }

    if(!this.props.node.parent){
      if(this.state.visible){
        this.setState({points:"12,75 12,120"})
      } else {
        this.setState({points:"0,0"})
      }
    } else {
      this.setState({'points':"12,0 12,75"})
    }

  }


  componentDidMount() {

  }

  render() {
  	var childNodes;

    if (this.props.node.children != null) {
      var childrenEndPoint = this.props.node.children.length;
      var width = 100/this.props.node.children.length
      const style = {
        width: 'auto'
      }
      const parent = this.props.node.name;

      const bubbleChange = () => {
          this.setState({childCount:1});
          var count = 1;
          if(this.props.node.children.length)
            this.props.node.children.map((node,index)=>{
              count+= node.childCount||1;
            })

          this.setState({childCount:count});
          this.props.node.childCount = count;
          if(this.props.node.bubbleChange)
            this.props.node.bubbleChange();
      };

      childNodes = this.props.node.children.map(function(node, index) {
        node.parent = parent;
        node.childrenEndPoint = !(childrenEndPoint-1)?-1:(!index?0:childrenEndPoint-index);
        node.bubbleChange = bubbleChange;
        return <div key={index} className="block-container" style={style}><TreeNode node={node}/></div>
      });

    } else {
      this.props.node.childCount = 1;
    }

    var style;
    if (!this.state.visible) {
      style = {display: "none"};
    }

    var binder = "binder ";
    if(this.props.node.childrenEndPoint === -1) {
      binder += "hide";
    } else if(this.props.node.childrenEndPoint === 1) {
      binder += "half-crop";
    } else if(this.props.node.childrenEndPoint === 0) {
      binder += "left-crop";
    }

    if(!this.props.node.parent){
      binder+= "hide"
    }

    return (
        <div className="block-container" ref="block" >
          <div className={binder} ></div>
            <div><svg height="24" width="24">
              <polyline points={this.state.points} className="connect-line" />
          </svg></div>
          <div className="block" id={ this.props.node.name } >
            <span className="block-employee" onClick={this.toggle} > { this.props.node.name }</span>
          <div >
            <span className="block-btn"><i className="fa fa-user"></i> : { this.props.node.children.length }</span>
            <span className="block-btn"><i className="fa fa-users"></i> : { this.state.childCount -1 }</span>
            <span className="block-btn" onClick={this.addChild}> + </span>
          </div>
          </div>
          <div style={style} className="child-row">
            {childNodes}
          </div>
        </div>
    );
  }
}


class Dashboard extends Component {
    render() {
        return ( <div className="App" >
                <TreeNode node={ data }/>
                <Navpad />
            </div>
        )
    }
}

export default App;
