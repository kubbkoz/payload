import "./hub.css";
import "./ikony.css";

/**
 * Payload 3 nemá v configu slot na vlastné štýly. Provider je jediné miesto,
 * odkiaľ sa CSS dostane do administrácie — nič nevykresľuje, len importuje
 * súbory a pustí obsah ďalej.
 */
export const HubStyl = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export default HubStyl;
