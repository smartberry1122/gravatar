const ScopeList = [
	'about',
	'avatars',
	'verified-accounts',
	'links',
	'interests',
	'contact-info',
	'wallet',
	'photos',
	'design',
	'privacy',
] as const;

const WINDOW_CHECK_INTERVAL = 500;

export type Scope = ( typeof ScopeList )[ number ][];

export type ProfileUpdatedType = 'avatar_updated' | 'profile_updated';

export type Open = ( email?: string ) => boolean;

export type OnProfileUpdated = ( type: ProfileUpdatedType ) => void;

export type OnOpened = () => void;
export type OnClosed = () => void;

export type QuickEditorCoreOptions = Partial< {
	email: string;
	scope: Scope;
	locale: string;
	onProfileUpdated: OnProfileUpdated;
	onOpened: OnOpened;
	onClosed: OnClosed;
} >;

export class GravatarQuickEditorCore {
	_name: string;
	_email: string;
	_scope: Scope;
	_locale: string;
	_onProfileUpdated: OnProfileUpdated;
	_onOpened: OnOpened;
	_onClosed: OnClosed;
	_window: Window | null = null;

	constructor( { email, scope = [], locale, onProfileUpdated, onOpened, onClosed }: QuickEditorCoreOptions ) {
		this._name = this._getName();
		this._email = email;
		this._scope = scope;
		this._locale = locale;
		this._onProfileUpdated = onProfileUpdated;
		this._onOpened = onOpened;
		this._onClosed = onClosed;

		if ( ! this._scope.every( ( s ) => ScopeList.includes( s ) ) ) {
			// eslint-disable-next-line
			console.error(
				'Gravatar Quick Editor: Invalid scope definition. Available scope: ' + ScopeList.join( ', ' )
			);
			this._scope = this._scope.filter( ( s ) => ScopeList.includes( s ) );
		}

		window.addEventListener( 'message', this._onMessage.bind( this ) );
	}

	open: Open = ( email ) => {
		email = email || this._email;

		if ( ! email ) {
			// eslint-disable-next-line
			console.error( 'Gravatar Quick Editor: Email not provided' );
			return false;
		}

		email = encodeURIComponent( email );
		const scope = encodeURIComponent( this._scope.join( ',' ) );

		const width = 400;
		const height = 720;
		const left = window.screenLeft + ( window.outerWidth - width ) / 2;
		const top = window.screenTop + ( window.outerHeight - height ) / 2;
		const options = `popup,width=${ width },height=${ height },top=${ top },left=${ left }`;
		const host = this._locale ? `https://${ this._locale }.gravatar.com` : 'https://gravatar.com';
		const url = `${ host }/profile?email=${ email }&scope=${ scope }&is_quick_editor=true`;

		this._window = window.open( url, this._name, options );

		if ( this._window === null ) {
			// eslint-disable-next-line
			console.error( 'Gravatar Quick Editor: Could not open window' );
			return false;
		}

		if ( this._onOpened ) {
			this._onOpened();
		}

		if ( this._onClosed ) {
			const timer = setInterval( () => {
				if ( this._window.closed ) {
					clearInterval( timer );
					this._onClosed();
				}
			}, WINDOW_CHECK_INTERVAL );
		}

		return true;
	};

	close = () => {
		if ( this._window ) {
			this._window.close();
		}
	};

	isOpen: () => boolean = () => {
		return this._window !== null && ! this._window.closed;
	};

	_getName() {
		return `GravatarQuickEditor_${ new Date().getTime() }${ Math.floor( Math.random() * ( 9999 - 1000 ) + 1000 ) }`;
	}

	_onMessage( event: MessageEvent ) {
		if ( ! this._onProfileUpdated || ! event.origin.match( /https:\/\/([a-z\-]{2,5}\.)?gravatar.com/ ) ) {
			return;
		}

		if ( event.data?.name !== this._name ) {
			return;
		}

		this._onProfileUpdated( event.data.type );
	}
}
