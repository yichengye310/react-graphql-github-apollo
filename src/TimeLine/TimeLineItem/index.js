import React from 'react';
import styles from './style.css';

const TimeLineItem = (props) => {
    return (<li className={'timeline__item'}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
    >
        <div className={'item__wrapper'} style={{
            width: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        }}>
            <div className={'item__line'} style={{
                marginLeft: '68px',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'row',
                justifyItems: 'center',
                alignItems: 'flex-start',
                position: 'relative',
            }}>
                <div className={'time'} style={{
                    color: 'rgb(250, 80, 80)',
                    padding: '4px 6px',
                    background: 'rgb(248,248,248)',
                    fontSize: '.66667em',
                    width: '65px',
                }}>{props.createdAt.split('T')[0]}</div>
                <div className={'item__circle'} style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    borderWidth: '4px',
                    borderStyle: 'solid',
                    borderColor: 'rgb(255,80,80)',
                    background: 'white',
                    zIndex: 9999,
                    marginLeft: '20px',
                    marginRight: '20px',
                }}>
                </div>
                <div className={'item__right'} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '150px',
                }}>
                    <div className={'right__top'} style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                        <div className={'top__name'} style={{
                            background: 'rgb(248, 248, 248)',
                            padding: '6px 10px',
                            borderRadius: '5px',
                            fontWeight: 600,
                            fontSize: '1.2vw'
                        }}>
                            {props.name}
                        </div>
                        {
                            props.isPrivate ? <></> :
                                <a className={'top__link'} href={props.url}
                                   style={{marginLeft: '.75rem', fontSize: '1vw'}}>Click me!</a>
                        }
                    </div>
                    <div className={'right__bottom'} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        fontSize: '0.6667em'
                    }}>
                        <div style={{marginLeft: '10px', marginTop: '10px'}}>{(props.primaryLanguage || {}).name}</div>
                        <div style={{
                            marginLeft: '10px', width: '120px', marginTop: '10px', overflowWrap: 'break-word',
                            wordWrap: 'break-word'
                        }}
                             dangerouslySetInnerHTML={{__html: props.descriptionHTML}}/>
                    </div>
                </div>
            </div>
        </div>
    </li>);
};

export default TimeLineItem;