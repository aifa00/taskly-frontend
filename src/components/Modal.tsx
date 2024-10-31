import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  onOuterClick: () => void;
  children: ReactNode;
}
const Modal: React.FC<ModalProps> = ({ onOuterClick, children }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 p-3 flex justify-center items-center bg-black/20 z-50"
      onClick={onOuterClick}
    >
      {children}
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default Modal;
