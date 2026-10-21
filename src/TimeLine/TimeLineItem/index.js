import React from "react";
import styles from './style.css';

const TimeLineItem = (props) => {
    return (<li className={"timeline__item"}>
        <div className="direction-l">
            <span className="time-wrapper"><span className="time">{props.createdAt.split('T')[0]}</span></span>
        </div>
        <div className="direction-r">
            <div className="flag-wrapper" style={{display: 'flex', alignItems: 'center'}}>
                <span className="flag">
                    {props.name}
                </span>
                {
                    props.isPrivate? <></>: <a href={props.url} style={{marginLeft: '.75rem', fontSize: '1vw'}}>Click me!</a>
                }
            </div>
            <div className="desc">{(props.primaryLanguage || {}).name}</div>
            <div className="desc" dangerouslySetInnerHTML={{__html: props.descriptionHTML}}/>
        </div>
    </li>)
}

export default TimeLineItem;