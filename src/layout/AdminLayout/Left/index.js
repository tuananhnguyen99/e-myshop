import clsx from 'clsx';
import Header from './Header';
import styles from './Left.module.css';
import Menu from './Menu';
function Left({ showMobile, collapse, handleSetCollapse, handleSetShowMenuMobile }) {
    return (
        <div
            className={clsx(styles.wrapper, {
                [styles.collapse]: collapse,
                [styles.showMobile]: showMobile,
            })}
        >
            <Header
                showMobile={showMobile}
                collapse={collapse}
                handleSetCollapse={handleSetCollapse}
                handleSetShowMenuMobile={handleSetShowMenuMobile}
            />
            <Menu collapse={collapse} />
        </div>
    );
}

export default Left;
