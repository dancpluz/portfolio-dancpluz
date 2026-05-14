/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export const Collections = {
	Authorigins: "_authOrigins",
	Externalauths: "_externalAuths",
	Mfas: "_mfas",
	Otps: "_otps",
	Superusers: "_superusers",
	Experience: "experience",
	Icons: "icons",
	Polaroids: "polaroids",
	Posts: "posts",
	Projects: "projects",
	Socials: "socials",
	Technologies: "technologies",
	Testimonials: "testimonials",
} as const
export type Collections = typeof Collections[keyof typeof Collections]

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type ExperienceRecord = {
	created: IsoAutoDateString
	description_en?: string
	description_pt?: string
	icon_ref: RecordIdString
	id: string
	start_date: IsoDateString
	title_en: string
	title_pt: string
	updated: IsoAutoDateString
}

export type IconsRecord = {
	alt: string
	created: IsoAutoDateString
	icon: FileNameString
	id: string
	updated: IsoAutoDateString
}

export type PolaroidsRecord = {
	created: IsoAutoDateString
	id: string
	photo: FileNameString
	text_en?: string
	text_pt?: string
	updated: IsoAutoDateString
}

export const PostsCategoryOptions = {
	"tutorial": "tutorial",
	"notícias": "notícias",
	"opinião": "opinião",
	"carreira": "carreira",
	"histórias": "histórias",
	"desenvolvimento": "desenvolvimento",
	"curiosidades": "curiosidades",
} as const
export type PostsCategoryOptions = typeof PostsCategoryOptions[keyof typeof PostsCategoryOptions]
export type PostsRecord<Tkeywords_en = unknown, Tkeywords_pt = unknown> = {
	article_en?: HTMLString
	article_pt: HTMLString
	category: PostsCategoryOptions
	created: IsoAutoDateString
	gifs?: FileNameString[]
	id: string
	images?: FileNameString[]
	keywords_en?: null | Tkeywords_en
	keywords_pt?: null | Tkeywords_pt
	long_text_en?: string
	long_text_pt?: string
	long_video?: FileNameString
	short_video?: FileNameString
	title_en?: string
	title_pt: string
	updated: IsoAutoDateString
	video_caption_en?: string
	video_caption_pt?: string
}

export const ProjectsProjectTypeOptions = {
	"web_app": "web_app",
	"mobile_app": "mobile_app",
	"landing_page": "landing_page",
	"e_commerce": "e_commerce",
	"api": "api",
	"open_source": "open_source",
	"saas": "saas",
	"videos": "videos",
} as const
export type ProjectsProjectTypeOptions = typeof ProjectsProjectTypeOptions[keyof typeof ProjectsProjectTypeOptions]

export const ProjectsCategoriesOptions = {
	"frontend": "frontend",
	"backend": "backend",
	"fullstack": "fullstack",
	"ui_ux": "ui_ux",
	"cloud": "cloud",
	"mobile": "mobile",
	"game": "game",
} as const
export type ProjectsCategoriesOptions = typeof ProjectsCategoriesOptions[keyof typeof ProjectsCategoriesOptions]
export type ProjectsRecord = {
	categories?: ProjectsCategoriesOptions[]
	client_en?: string
	client_pt?: string
	cover: FileNameString
	created: IsoAutoDateString
	date: IsoDateString
	description_en?: HTMLString
	description_pt?: HTMLString
	id: string
	medias?: FileNameString[]
	project_type: ProjectsProjectTypeOptions
	social_refs?: RecordIdString[]
	subtitle_en?: string
	subtitle_pt: string
	title_en?: string
	title_pt: string
	updated: IsoAutoDateString
	url?: string
}

export type SocialsRecord = {
	created: IsoAutoDateString
	icon_ref: RecordIdString
	id: string
	main?: boolean
	subtext_en?: string
	subtext_pt?: string
	text: string
	updated: IsoAutoDateString
	url: string
}

export type TechnologiesRecord = {
	created: IsoAutoDateString
	icon_ref: RecordIdString
	id: string
	tooltip_en?: string
	tooltip_pt?: string
	updated: IsoAutoDateString
}

export type TestimonialsRecord = {
	content: string
	created: IsoAutoDateString
	date?: IsoDateString
	id: string
	profile: FileNameString
	subtitle: string
	title: string
	updated: IsoAutoDateString
	url?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ExperienceResponse<Texpand = unknown> = Required<ExperienceRecord> & BaseSystemFields<Texpand>
export type IconsResponse<Texpand = unknown> = Required<IconsRecord> & BaseSystemFields<Texpand>
export type PolaroidsResponse<Texpand = unknown> = Required<PolaroidsRecord> & BaseSystemFields<Texpand>
export type PostsResponse<Tkeywords_en = unknown, Tkeywords_pt = unknown, Texpand = unknown> = Required<PostsRecord<Tkeywords_en, Tkeywords_pt>> & BaseSystemFields<Texpand>
export type ProjectsResponse<Texpand = unknown> = Required<ProjectsRecord> & BaseSystemFields<Texpand>
export type SocialsResponse<Texpand = unknown> = Required<SocialsRecord> & BaseSystemFields<Texpand>
export type TechnologiesResponse<Texpand = unknown> = Required<TechnologiesRecord> & BaseSystemFields<Texpand>
export type TestimonialsResponse<Texpand = unknown> = Required<TestimonialsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	experience: ExperienceRecord
	icons: IconsRecord
	polaroids: PolaroidsRecord
	posts: PostsRecord
	projects: ProjectsRecord
	socials: SocialsRecord
	technologies: TechnologiesRecord
	testimonials: TestimonialsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	experience: ExperienceResponse
	icons: IconsResponse
	polaroids: PolaroidsResponse
	posts: PostsResponse
	projects: ProjectsResponse
	socials: SocialsResponse
	technologies: TechnologiesResponse
	testimonials: TestimonialsResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
