import React from 'react';
import { Nav } from 'react-bootstrap';
import styles from './BoardAside.module.css';

const BoardAside = ({ username }) => (
  <div className={`${styles.dashboard_container_left} ${styles.active}`}>
    <Nav defaultActiveKey="/home" className="flex-column">
      <div className={styles.workspace}>
        <Nav.Link
          eventKey="disabled"
          disabled
          className={styles.link_workspace}
        >
          {username}
        </Nav.Link>
        <button className={styles.btn} type="button">
          <i className={`bi bi-chevron-left ${styles.arrow}`} />
        </button>
      </div>

      <!--<Nav.Link href="" className={styles.link}>
        <i className={`bi bi-kanban-fill ${styles.rightIconIndent}`} />
        Boards
      </Nav.Link>

      <Nav.Link eventKey="link-2" className={styles.link}>
        <i className={`bi bi-gear-fill ${styles.rightIconIndent}`} />
        Settings
      </Nav.Link>-->
    </Nav>
  </div>
);

export { BoardAside };
