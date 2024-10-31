import Modal from "../components/Modal";

interface DialogProps {
  dialog: {
    message: string;
    buttonLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
  };
}

function Dialog({ dialog }: DialogProps) {
  return (
    <Modal onOuterClick={dialog.onCancel}>
      <div
        className="fixed flex items-center justify-center 
      p-3 top-0 left-0 right-0 bottom-0 bg-black/10 z-50"
      >
        <div className="w-96 p-10 bg-white rounded-lg shadow text-center">
          <h1 className="text-xl">{dialog.message}</h1> <br />
          <div className="flex">
            <button
              className="flex-1 p-2 rounded mx-2 hover:bg-gray-100"
              onClick={dialog.onCancel}
            >
              Cancel
            </button>
            <button
              className="flex-1 text-white bg-pink-950 p-2 rounded mx-2 hover:bg-pink-900"
              onClick={dialog.onSuccess}
            >
              {dialog.buttonLabel ? dialog.buttonLabel : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Dialog;
