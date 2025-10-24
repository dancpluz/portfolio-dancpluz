/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Experience = "experience",
	Icons = "icons",
	Posts = "posts",
	Projects = "projects",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
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
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type ExperienceRecord = {
	created?: IsoDateString
	end_date?: IsoDateString
	icon_ref: RecordIdString
	id: string
	start_date: IsoDateString
	title: string
	updated?: IsoDateString
}

export type IconsRecord = {
	alt: string
	contact?: boolean
	created?: IsoDateString
	icon: string
	id: string
	link?: string
	technology?: boolean
	updated?: IsoDateString
}

export enum PostsCategoryOptions {
	"tutorial" = "tutorial",
	"notícias" = "notícias",
	"opinião" = "opinião",
	"carreira" = "carreira",
	"histórias" = "histórias",
	"desenvolvimento" = "desenvolvimento",
	"curiosidades" = "curiosidades",
}
export type PostsRecord<Tkeywords = unknown> = {
	article?: HTMLString
	category?: PostsCategoryOptions
	created?: IsoDateString
	gifs?: string[]
	id: string
	images?: string[]
	keywords?: null | Tkeywords
	long_text?: string
	long_video?: string
	short_video?: string
	title: string
	updated?: IsoDateString
	video_caption?: string
}

export type ProjectsRecord = {
	cover?: string
	created?: IsoDateString
	end_date?: IsoDateString
	icon_refs?: RecordIdString[]
	id: string
	link?: string
	start_date: IsoDateString
	subtitle?: string
	text?: string
	title: string
	updated?: IsoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ExperienceResponse<Texpand = unknown> = Required<ExperienceRecord> & BaseSystemFields<Texpand>
export type IconsResponse<Texpand = unknown> = Required<IconsRecord> & BaseSystemFields<Texpand>
export type PostsResponse<Tkeywords = unknown, Texpand = unknown> = Required<PostsRecord<Tkeywords>> & BaseSystemFields<Texpand>
export type ProjectsResponse<Texpand = unknown> = Required<ProjectsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	experience: ExperienceRecord
	icons: IconsRecord
	posts: PostsRecord
	projects: ProjectsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	experience: ExperienceResponse
	icons: IconsResponse
	posts: PostsResponse
	projects: ProjectsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'experience'): RecordService<ExperienceResponse>
	collection(idOrName: 'icons'): RecordService<IconsResponse>
	collection(idOrName: 'posts'): RecordService<PostsResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
}
