import React from 'react';
import styles from './style.css';

const TimeLineItem = (props) => {
    return (<li className={'timeline__line'}>
        <div className={'line__wrapper'}>
            <div className={'line__item'}>
                <div className={'item__time'}>
                    <div className={'time'}>{props.createdAt.split('T')[0]}</div>
                </div>
                <div className={'item__circle'}></div>
                <div className={'item__repo'}>
                    <div className={'repo'}>
                        <div className={'repo__top'}>
                            <div className={'top__name'}>
                                {props.name}
                            </div>
                            {
                                props.isPrivate ? <></> :
                                    <div className={'top__link'}><a href={props.url}>Click me!</a></div>
                            }
                        </div>
                        <div className={'repo__bottom'}>
                            <div className={'bottom__language'}>
                                {(props.primaryLanguage || {}).name}
                            </div>
                            <div className={'bottom__desc'}
                                 dangerouslySetInnerHTML={{__html: props.descriptionHTML}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </li>);
};

export default TimeLineItem;