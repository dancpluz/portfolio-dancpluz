/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Experience = "experience",
	Icons = "icons",
	Projects = "projects",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ExperienceRecord = {
	end_date?: IsoDateString
	icon_ref: RecordIdString
	start_date: IsoDateString
	title: string
}

export type IconsRecord = {
	alt: string
	contact?: boolean
	icon: string
	link?: string
	technology?: boolean
}

export type ProjectsRecord = {
	cover?: string
	end_date?: IsoDateString
	icon_refs?: RecordIdString[]
	link?: string
	start_date: IsoDateString
	subtitle?: string
	text?: string
	title: string
}

// Response types include system fields and match responses from the PocketBase API
export type ExperienceResponse<Texpand = unknown> = Required<ExperienceRecord> & BaseSystemFields<Texpand>
export type IconsResponse<Texpand = unknown> = Required<IconsRecord> & BaseSystemFields<Texpand>
export type ProjectsResponse<Texpand = unknown> = Required<ProjectsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	experience: ExperienceRecord
	icons: IconsRecord
	projects: ProjectsRecord
}

export type CollectionResponses = {
	experience: ExperienceResponse
	icons: IconsResponse
	projects: ProjectsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'experience'): RecordService<ExperienceResponse>
	collection(idOrName: 'icons'): RecordService<IconsResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
}
