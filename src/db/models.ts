import { DataTypes, Model, Relationships } from "../deps.ts";

export class Challenge extends Model {
  static table = "challenge";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static tags() {
    return this.hasMany(Tag);
  }
}

export class Tag extends Model {
  static table = "tag";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static challenges() {
    return this.hasMany(Challenge);
  }

  static sentences() {
    return this.hasMany(Sentence);
  }
}

export class Sentence extends Model {
  static table = "sentence";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  static tags() {
    return this.hasMany(Tag);
  }

  static ja() {
    return this.hasMany(Japanese);
  }
}

export const TagChallenge = Relationships.manyToMany(Tag, Challenge);
export const TagSentence = Relationships.manyToMany(Tag, Sentence);

export class Japanese extends Model {
  static table = "japanese";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sentenceId: Relationships.belongsTo(Sentence),
  };

  static sentence() {
    return this.hasOne(Sentence);
  }
}