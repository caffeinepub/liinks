import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Category = string;
export type Time = bigint;
export type TemplateId = string;
export interface BioPage {
    bioText: string;
    title: string;
    templateId: TemplateId;
    userId: UserId;
    createdAt: Time;
    links: Array<Link>;
    updatedAt: Time;
    socialHandles: Array<SocialHandle>;
}
export interface Template {
    id: TemplateId;
    status: TemplateStatus;
    thumbnail: ExternalBlob;
    editableContent: Uint8Array;
    name: string;
    createdAt: Time;
    creatorId?: UserId;
    description: string;
    category: Category;
}
export type UserId = Principal;
export type LinkId = string;
export type SocialHandleId = string;
export interface Link {
    id: LinkId;
    url: string;
    title: string;
    description: string;
}
export interface SocialHandle {
    id: SocialHandleId;
    url: string;
    username: string;
    platform: string;
}
export interface UserProfile {
    subscription?: SubscriptionTier;
    userId: UserId;
    subscriptionExpiry?: Time;
    email: string;
    phoneNumber: string;
    lastName: string;
    firstName: string;
}
export type ShareId = string;
export enum SubscriptionTier {
    pro = "pro",
    premium = "premium"
}
export enum TemplateStatus {
    published = "published",
    unlisted = "unlisted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmSubscription(): Promise<void>;
    createBioPage(templateId: TemplateId, title: string, bioText: string, socialHandles: Array<SocialHandle>, links: Array<Link>): Promise<void>;
    getAllTemplates(): Promise<Array<Template>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFamousInfluencers(category: Category): Promise<Array<UserProfile>>;
    getSharedBio(shareId: ShareId): Promise<BioPage | null>;
    getTemplatesByCategory(category: Category): Promise<Array<Template>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasActiveSubscription(): Promise<boolean>;
    initiateSubscription(tier: SubscriptionTier, duration: Time, paymentReference: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isRegistered(): Promise<boolean>;
    registerProfile(firstName: string, lastName: string, email: string, phoneNumber: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFamousInfluencer(category: Category, profile: UserProfile): Promise<void>;
    uploadTemplate(name: string, category: Category, description: string, thumbnail: ExternalBlob, editableContent: Uint8Array): Promise<TemplateId>;
}
