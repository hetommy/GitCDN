/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** GitHub Personal Access Token - Token with 'repo' scope for repository access */
  "githubToken": string,
  /** GitHub Owner - Your GitHub username or organization name */
  "githubOwner": string,
  /** GitHub Repository - Repository name where CDN files are stored */
  "githubRepo": string,
  /** GitHub Branch - Branch to use for CDN files (default: main) */
  "githubBranch": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `view-files` command */
  export type ViewFiles = ExtensionPreferences & {}
  /** Preferences accessible in the `upload-file` command */
  export type UploadFile = ExtensionPreferences & {}
  /** Preferences accessible in the `delete-file` command */
  export type DeleteFile = ExtensionPreferences & {}
  /** Preferences accessible in the `rename-file` command */
  export type RenameFile = ExtensionPreferences & {}
  /** Preferences accessible in the `repo-status` command */
  export type RepoStatus = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `view-files` command */
  export type ViewFiles = {}
  /** Arguments passed to the `upload-file` command */
  export type UploadFile = {}
  /** Arguments passed to the `delete-file` command */
  export type DeleteFile = {}
  /** Arguments passed to the `rename-file` command */
  export type RenameFile = {}
  /** Arguments passed to the `repo-status` command */
  export type RepoStatus = {}
}

