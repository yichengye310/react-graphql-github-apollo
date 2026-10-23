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
        <div style={{
            width: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        }}>
            <div style={{
                marginLeft: '63px',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'row',
                justifyItems: 'center',
                justifySelf: 'flex-start',
                alignItems: 'flex-start',
                position: 'relative',
            }}>
                <div style={{
                    color: 'rgb(250, 80, 80)',
                    padding: '4px 6px',
                    background: 'rgb(248,248,248)',
                    fontSize: '.66667em',
                    width: '70px',
                }}>{props.createdAt.split('T')[0]}</div>
                <div style={{
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '150px',
                }}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <span style={{
                        background: 'rgb(248, 248, 248)',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        fontWeight: 600,
                        fontSize: '1.2vw'
                    }}>
                        {props.name}
                    </span>
                        {
                            props.isPrivate ? <></> :
                                <a href={props.url} style={{marginLeft: '.75rem', fontSize: '1vw'}}>Click me!</a>
                        }
                    </div>
                    <div style={{
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