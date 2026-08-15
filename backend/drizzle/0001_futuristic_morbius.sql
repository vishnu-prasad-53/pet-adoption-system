CREATE TYPE "public"."energy_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."pet_status" AS ENUM('available', 'pending', 'adopted', 'fostered', 'medical_hold', 'not_available', 'returned');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('small', 'medium', 'large', 'xlarge');--> statement-breakpoint
CREATE TABLE "breeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"species_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_tag_map" (
	"pet_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "pet_tag_map_pet_id_tag_id_pk" PRIMARY KEY("pet_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "pet_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "pet_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shelter_id" uuid NOT NULL,
	"name" text NOT NULL,
	"species_id" uuid NOT NULL,
	"breed_id" uuid,
	"age_years" integer,
	"age_months" integer,
	"gender" "gender" NOT NULL,
	"size" "size",
	"weight_lbs" double precision,
	"color" text,
	"vaccinated" boolean DEFAULT false NOT NULL,
	"house_trained" boolean DEFAULT false NOT NULL,
	"good_with_kids" boolean,
	"good_with_dogs" boolean,
	"good_with_cats" boolean,
	"energy_level" "energy_level",
	"description" text,
	"status" "pet_status" DEFAULT 'available' NOT NULL,
	"adoption_fee" double precision,
	"intake_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "species" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "species_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_tag_map" ADD CONSTRAINT "pet_tag_map_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_tag_map" ADD CONSTRAINT "pet_tag_map_tag_id_pet_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."pet_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_shelter_id_shelters_id_fk" FOREIGN KEY ("shelter_id") REFERENCES "public"."shelters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_species_id_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_breed_id_breeds_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE cascade ON UPDATE no action;