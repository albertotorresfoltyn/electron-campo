import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

const propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  closeOnMiss: PropTypes.bool,
};

class Modal extends React.Component {
  static modals = []

  static open = id => (e) => {
    e.preventDefault();
    // open modal specified by id
    const modal = Modal.modals.find(x => x.props.id === id);
    modal.setState({ isOpen: true });
    document.body.classList.add(styles['cm-modal-open']);
  }

  static close = id => (e) => {
    e.preventDefault();
    // close modal specified by id
    const modal = Modal.modals.find(x => x.props.id === id);
    modal.setState({ isOpen: false });
    document.body.classList.remove(styles['cm-modal-open']);
  }

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // move element to bottom of page (just before </body>)
    // so it can be displayed above everything else
    document.body.appendChild(this.element);
    // add this modal instance to the modal pool so it's accessible from other components
    Modal.modals.push(this);
  }

  componentWillUnmount() {
    // remove this modal instance from modal service
    Modal.modals = Modal.modals.filter(x => x.props.id !== this.props.id);
    this.element.remove();
  }

  handleClick(e) {
    // close modal on background click
    if ((e.target.className === styles['cm-modal']) && (this.props.closeOnMiss)) {
      Modal.close(this.props.id)(e);
    }
  }

  render() {
    return (
      <div
        role="menuitem"
        tabIndex={0}
        onKeyDown={e => e}
        style={{ display: +this.state.isOpen ? '' : 'none' }}
        onClick={this.handleClick}
        ref={(el) => {
          this.element = el;
          return el;
        }}
      >
        <div className={styles['cm-modal']}>
          <div className={styles['cm-modal-body']}>{this.props.children}</div>
        </div>
        <div className={styles['cm-modal-background']} />
      </div>
    );
  }
}

Modal.defaultProps = {
  closeOnMiss: true,
};

Modal.propTypes = propTypes;

export default Modal; // TODO: Add another layer of abstraction?
