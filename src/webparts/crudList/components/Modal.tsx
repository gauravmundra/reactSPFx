import * as React from "react";
import { Modal, ModalHeader } from "reactstrap";

export interface IModalProps {
  buttonLabel: string;
  modalTitle: string;
  buttonColor: string;
  render: Function;
}

export interface IModalState {
  modal: boolean;
}

export default class Modal_ extends React.Component<IModalProps, IModalState> {
  constructor(props: IModalProps, state: IModalState) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  private toggle = (): void => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  public render(): React.ReactElement<IModalProps> {
    const closeBtn: JSX.Element = (
      <button className="close" onClick={this.toggle}>
        &times;
      </button>
    );

    const button: JSX.Element = (
      <button
        type="button"
        className={`btn btn-sm btn-${this.props.buttonColor}`}
        onClick={this.toggle}
      >
        {this.props.buttonLabel}
      </button>
    );

    return (
      <>
        {button}
        <Modal
          centered={true}
          isOpen={this.state.modal}
          toggle={this.toggle}
          backdrop="static"
          unmountOnClose={true}
        >
          <ModalHeader toggle={this.toggle} close={closeBtn}>
            {this.props.modalTitle}
          </ModalHeader>

          {this.props.render(this.toggle)}
        </Modal>
      </>
    );
  }
}
