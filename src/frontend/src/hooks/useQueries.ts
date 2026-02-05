import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Template, Category, SubscriptionTier, SocialHandle, Link, TemplateId, BioPage, ShareId } from '../backend';
import { ExternalBlob } from '../backend';
import { SEED_TEMPLATES } from '../data/seedTemplates';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string; phoneNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerProfile(data.firstName, data.lastName, data.email, data.phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      if (!actor) return SEED_TEMPLATES;
      try {
        const backendTemplates = await actor.getAllTemplates();
        // If backend returns empty, use seed templates as fallback
        if (backendTemplates.length === 0) {
          return SEED_TEMPLATES;
        }
        return backendTemplates;
      } catch (error) {
        console.error('Failed to fetch templates, using seed templates:', error);
        return SEED_TEMPLATES;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTemplatesByCategory(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<Template[]>({
    queryKey: ['templates', category],
    queryFn: async () => {
      if (!actor) return SEED_TEMPLATES.filter((t) => t.category === category);
      try {
        const backendTemplates = await actor.getTemplatesByCategory(category);
        // If backend returns empty, filter seed templates
        if (backendTemplates.length === 0) {
          return SEED_TEMPLATES.filter((t) => t.category === category);
        }
        return backendTemplates;
      } catch (error) {
        console.error('Failed to fetch templates by category, using seed templates:', error);
        return SEED_TEMPLATES.filter((t) => t.category === category);
      }
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useHasActiveSubscription() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['subscription', 'active'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasActiveSubscription();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscribe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { tier: SubscriptionTier; duration: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.subscribe(data.tier, data.duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateBioPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      templateId: TemplateId;
      title: string;
      bioText: string;
      socialHandles: SocialHandle[];
      links: Link[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBioPage(data.templateId, data.title, data.bioText, data.socialHandles, data.links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bioPages'] });
    },
  });
}

export function useUploadTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: Category;
      description: string;
      thumbnail: ExternalBlob;
      editableContent: Uint8Array;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadTemplate(data.name, data.category, data.description, data.thumbnail, data.editableContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useGetFamousInfluencers(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['influencers', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFamousInfluencers(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetSharedBio(shareId: ShareId) {
  const { actor, isFetching } = useActor();

  return useQuery<BioPage | null>({
    queryKey: ['sharedBio', shareId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSharedBio(shareId);
    },
    enabled: !!actor && !isFetching && !!shareId,
    retry: false,
  });
}
