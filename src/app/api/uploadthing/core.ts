import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  blogImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Blog image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),

  doctorImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Doctor image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),

  testimonialImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Testimonial image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),

  diagnosticServiceImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Diagnostic service image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),

  heroSectionImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Hero section image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),

  galleryImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Gallery image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),

  aboutImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("About image upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
