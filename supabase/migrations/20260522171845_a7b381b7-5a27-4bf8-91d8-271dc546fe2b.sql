-- Interest manifestations
CREATE TABLE public.interest_manifestations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  engagement_amount TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.interest_manifestations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit interest" ON public.interest_manifestations FOR INSERT WITH CHECK (true);

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all interests" ON public.interest_manifestations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- Site settings
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('profile', '{"name": "Jean-Guy", "title": "Entrepreneur digital & porteur de projets", "tagline": "Je conçois et exécute des projets digitaux et opérationnels adaptés aux réalités africaines.", "status_text": "Initiative ouverte – Phase pilote"}'::jsonb),
  ('contact', '{"whatsapp_number": "221770000000", "whatsapp_message": "Bonjour Jean-Guy, je souhaite planifier un échange de clarification de 20 minutes concernant initiative CAISSE PLUS.", "email": "contact@example.com", "linkedin_url": "https://linkedin.com/in/example"}'::jsonb),
  ('hero', '{"title": "Construisons ensemble une solution utile, claire et maîtrisée.", "highlight": "solution utile", "subtitle": "Une initiative portée par un entrepreneur africain, ouverte à un collectif structuré, sans promesses irréalistes ni paiement précipité."}'::jsonb),
  ('about', '{"title": "Qui je suis", "paragraphs": ["Je suis entrepreneur digital et créatif.", "Je conçois, développe et exécute des projets concrets : plateformes web, applications, solutions encaissement, impression & branding, ainsi que des concepts de restauration.", "J ai dirigé et opéré des projets à Dakar et ailleurs, en combinant vision, technique et exécution terrain."]}'::jsonb),
  ('skills', '{"title": "Ce que je sais faire", "items": [{"icon": "Globe", "title": "Plateformes web & applications", "description": "Sites vitrines, applications métier, outils SaaS"}, {"icon": "CreditCard", "title": "Solutions de paiement & encaissement", "description": "Intégration mobile money, terminaux, gestion de caisse"}, {"icon": "Palette", "title": "Branding, impression & produits", "description": "Identité visuelle, supports imprimés, merchandising"}, {"icon": "Rocket", "title": "Exécution opérationnelle", "description": "Gestion de projet, coordination équipe, livraison terrain"}]}'::jsonb),
  ('project', '{"badge": "Projet pilote", "title": "CAISSE PLUS", "description": "CAISSE PLUS est une solution digitale simple destinée à faciliter la gestion des encaissements et paiements, pensée pour les réalités locales.", "features": [{"icon": "Target", "text": "Problème clair et concret"}, {"icon": "Lightbulb", "text": "Solution simple et compréhensible"}, {"icon": "TrendingUp", "text": "Déploiement progressif"}, {"icon": "Layers", "text": "Phase pilote avant toute expansion"}]}'::jsonb),
  ('timeline', '{"title": "Comment fonctionne initiative", "steps": [{"number": 1, "title": "Manifestation intérêt", "subtitle": "sans paiement"}, {"number": 2, "title": "Choix engagement indicatif", "subtitle": "minimum 50 000 CFA"}, {"number": 3, "title": "Atteinte seuil collectif", "subtitle": ""}, {"number": 4, "title": "Réunion de clarification", "subtitle": ""}, {"number": 5, "title": "Accord écrit", "subtitle": ""}, {"number": 6, "title": "Déblocage des fonds", "subtitle": ""}, {"number": 7, "title": "Lancement du projet pilote", "subtitle": ""}], "note": "Aucun paiement demandé avant validation collective et accord écrit."}'::jsonb),
  ('structure', '{"title": "Structure et gouvernance", "total_parts": 100, "founder_percent": 51, "collective_percent": 49, "part_price": 50000, "founder_name": "Jean-Guy", "explanation_1": "Une part fondatrice est réservée à initiateur du projet, correspondant à la conception, la coordination et exécution opérationnelle.", "explanation_2": "Les 49 parts restantes sont ouvertes au collectif, permettant une participation équitable tout en maintenant une gouvernance claire et une prise de décision efficace.", "investment_note": "Investissement libre au-delà du minimum"}'::jsonb),
  ('trust', '{"title": "Confiance & garde-fous", "guarantees": [{"icon": "Ban", "text": "Pas de paiement immédiat"}, {"icon": "FileText", "text": "Règles écrites avant engagement"}, {"icon": "Users", "text": "Gouvernance claire"}, {"icon": "DoorOpen", "text": "Possibilité de sortie encadrée"}, {"icon": "MessageSquare", "text": "Communication collective"}]}'::jsonb),
  ('cta', '{"title": "Prêt à rejoindre initiative ?", "subtitle": "Cette initiative adresse à des personnes sérieuses, prêtes à construire sur des bases claires.", "button_primary": "Manifester mon intérêt", "button_secondary": "Échange de clarification – 20 min"}'::jsonb),
  ('form_fields', '{"title": "Manifester mon intérêt", "description": "Aucun paiement demandé à ce stade. Nous vous contacterons pour la suite.", "success_title": "Merci pour votre intérêt !", "success_message": "Nous reviendrons vers vous très bientôt.", "submit_button": "Envoyer ma manifestation", "engagement_amounts": [{"value": "50000", "label": "50 000 CFA (1 part)"}, {"value": "100000", "label": "100 000 CFA (2 parts)"}, {"value": "200000", "label": "200 000 CFA (4 parts)"}, {"value": "500000", "label": "500 000 CFA (10 parts)"}, {"value": "libre", "label": "Montant libre"}]}'::jsonb);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Admins can upload profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update profile photos" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete profile photos" ON storage.objects FOR DELETE USING (bucket_id = 'profile-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Portfolio
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}'::text[],
  year text,
  role text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view portfolio items" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert portfolio items" ON public.portfolio_items FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio items" ON public.portfolio_items FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio items" ON public.portfolio_items FOR DELETE USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
CREATE POLICY "Portfolio images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Admins can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'));

INSERT INTO public.portfolio_items (title, description, image_url, category, tags, year, role, display_order) VALUES
  ('eLOOkx — Brand Cover', 'Identité visuelle d''une plateforme de streaming panafricaine. Direction artistique sombre et cinématographique mêlant affiches de films et signature lumineuse.', 'https://qpffzbxirolpeocnxdak.supabase.co/storage/v1/object/public/portfolio/elookx-brand.png', 'Branding', ARRAY['Branding','Visual Identity','Streaming','Cinematic'], '2024', 'Creative Direction', 1),
  ('eLOOkx — Communication', 'Visuel de lancement pour une plateforme de streaming par abonnement. Mise en scène produit et hiérarchie typographique premium.', 'https://qpffzbxirolpeocnxdak.supabase.co/storage/v1/object/public/portfolio/elookx-mobile-2.png', 'Marketing', ARRAY['Marketing','Communication','Mobile App','SaaS'], '2024', 'Art Direction', 2),
  ('eLOOkx — Mobile App', 'Interface principale de l''application mobile : navigation par catégories, mise en avant des originaux et expérience cinéma.', 'https://qpffzbxirolpeocnxdak.supabase.co/storage/v1/object/public/portfolio/elookx-mobile-1.png', 'Mobile App', ARRAY['UI/UX','Mobile App','Streaming','Product Design'], '2024', 'Product Designer', 3),
  ('eLOOkx — Hero Web + App', 'Concept hero responsive pour la sortie d''ISIBAYA. Composition desktop cinématographique avec relais mobile cohérent.', 'https://qpffzbxirolpeocnxdak.supabase.co/storage/v1/object/public/portfolio/elookx-isibaya.png', 'UI Design', ARRAY['UI Design','Web','Mobile','Cinematic'], '2024', 'Lead Designer', 4),
  ('LOKIX — Marketplace App', 'Application de petites annonces orientée Afrique de l''Ouest : achat, vente et paiement mobile. Onboarding et fiche produit.', 'https://qpffzbxirolpeocnxdak.supabase.co/storage/v1/object/public/portfolio/lokix-app.png', 'Mobile App', ARRAY['Mobile App','Marketplace','Product','UI/UX'], '2023', 'Product Designer', 5),
  ('BORO — Social Network', 'Réseau social communautaire avec stories, feed et messagerie. Identité chaleureuse, focus sur l''expression et la viralité locale.', 'https://qpffzbxirolpeocnxdak.supabase.co/storage/v1/object/public/portfolio/boro-social.png', 'Mobile App', ARRAY['Social','Mobile App','Product','Community'], '2023', 'Product & UI Designer', 6);