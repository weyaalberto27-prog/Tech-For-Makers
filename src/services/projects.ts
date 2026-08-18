import {
  db,
  isRemixed,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export interface ProjectData {
  id?: string;
  ownerId: string;
  name: string;
  elements?: string;
  pcbElements?: string;
  parts?: any[];
  wiringConnections?: any[];
  updateAt?: any;
  updatedAt?: any;
}

export const saveProject = async (
  ownerId: string,
  name: string,
  elements: any,
  pcbElements: any,
  projectId?: string,
) => {
  if (isRemixed) {
    const lsData = localStorage.getItem("allvatronics_projects");
    const projects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
    if (projectId) {
      const p = projects.find((x: any) => x.id === projectId);
      if (p) {
        p.elements = JSON.stringify(elements);
        p.pcbElements = JSON.stringify(pcbElements);
        p.updateAt = { toDate: () => new Date() };
      }
    } else {
      projectId = uuidv4();
      projects.push({
        id: projectId,
        ownerId,
        name,
        elements: JSON.stringify(elements),
        pcbElements: JSON.stringify(pcbElements),
        updateAt: { toDate: () => new Date() },
      });
    }
    localStorage.setItem("allvatronics_projects", JSON.stringify(projects));
    return projectId;
  }

  const projectsRef = collection(db, "projects");

  const projectData = {
    ownerId,
    name,
    elements: JSON.stringify(elements),
    pcbElements: JSON.stringify(pcbElements),
    updateAt: Timestamp.now(),
  };

  try {
    if (projectId) {
      const docRef = doc(db, "projects", projectId);
      await updateDoc(docRef, projectData);
      return projectId;
    } else {
      const docRef = await addDoc(projectsRef, projectData);
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "projects");
    throw error;
  }
};

export const getProjects = async (ownerId: string) => {
  if (isRemixed) {
    const lsData = localStorage.getItem("allvatronics_projects");
    const projects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
    return projects.map((p: any) => ({
      ...p,
      updateAt: {
        toDate: () => new Date(p.updateAt?.toDate ? new Date() : p.updateAt || p.updatedAt),
      },
    }));
  }

  const q = query(collection(db, "projects"), where("ownerId", "==", ownerId));
  try {
    const querySnapshot = await getDocs(q);
    const projects: ProjectData[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as ProjectData);
    });
    return projects;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "projects");
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  if (isRemixed) {
    const lsData = localStorage.getItem("allvatronics_projects");
    let projects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
    projects = projects.filter((x: any) => x.id !== projectId);
    localStorage.setItem("allvatronics_projects", JSON.stringify(projects));
    return;
  }

  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}`);
    throw error;
  }
};
