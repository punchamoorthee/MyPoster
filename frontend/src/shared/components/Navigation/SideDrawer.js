import "./SideDrawer.css";

import { CSSTransition } from "react-transition-group";
import React from "react";
import ReactDOM from "react-dom";

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.visible}
      timeout={300}
      classNames='slide-in-left'
      mountOnEnter
      unmountOnExit>
      <aside onClick={props.onClick} className='side-drawer'>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
