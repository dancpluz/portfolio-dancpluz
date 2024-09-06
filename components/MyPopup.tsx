import { JSX, RefAttributes } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps, PopupActions } from 'reactjs-popup/dist/types';


export default function MyPopup(props: JSX.IntrinsicAttributes & PopupProps & RefAttributes<PopupActions>) {
  const contentStyle = { animation: `${(typeof props.position === 'string' ? props.position : '').split(' ')[0] === 'top' ? 'pop-in-t' : 'pop-in-r'} 0.3s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards`, fontSize: '16px',background: 'rgba(var(--background))', border: '1px solid rgba(var(--foreground))', borderRadius: '4px', padding: '8px' };
  //const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
  const arrowStyle = { color: 'rgba(var(--foreground))' }; // style for an svg element

  return <Popup {...props} {...{contentStyle, arrowStyle}} />
}
