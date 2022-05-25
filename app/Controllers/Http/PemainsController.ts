import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Application from "@ioc:Adonis/Core/Application";
import Pemain from "App/Models/Pemain";
import DetailPemainBasket from "App/Models/DetailPemainBasket";
import DetailPemainFutsal from "App/Models/DetailPemainFutsal";

export default class PemainsController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input("page", 1);
      return await Pemain.query().paginate(page, 50);
    } catch (error) {
      return response.notFound(error);
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const {
        posisi,
        nomor_punggung,
        nickname,
        deskripsi,
        user_id,
        facebook,
        twitter,
        instagram,
        youtube,
        tiktok,
        tinggi_badan,
        berat_badan,
        tempat_lahir,
        pendidikan,
        foot,
        cabor,
        tim_id,
      } = request.body();

      const foto = request.file("foto", {
        size: "2mb",
        extnames: ["jpg", "png", "jpeg", "svg"],
      });

      await foto?.move(Application.publicPath("foto/fotoPemain"));

      const fotoPemain = `${foto?.fileName?.toLowerCase()}-${
        new Date().getTime() + ""
      }.${foto?.extname}`;

      const pemain = await Pemain.create({
        posisi: posisi,
        nomorPunggung: nomor_punggung,
        nickname: nickname,
        deskripsi: deskripsi,
        userId: user_id,
        timId: tim_id,
        foto: `foto/fotoPemain/${fotoPemain}`,
        facebook: facebook,
        twitter: twitter,
        instagram: instagram,
        youtube: youtube,
        tiktok: tiktok,
      });

      if (cabor == "basket") {
        await DetailPemainBasket.create({
          tinggiBadan: tinggi_badan,
          beratBadan: berat_badan,
          tempatLahir: tempat_lahir,
          pemainId: pemain.id,
        });
      } else {
        await DetailPemainFutsal.create({
          tinggiBadan: tinggi_badan,
          beratBadan: berat_badan,
          tempatLahir: tempat_lahir,
          pendidikan: pendidikan,
          foot: foot,
          pemainId: pemain.id,
        });
      }

      return pemain;
    } catch (error) {
      return response.badRequest(error);
    }
  }

  public async show({ params: { id } }: HttpContextContract) {
    return await Pemain.query()
      .where({ id })
      .preload("detailPemainBasket")
      .preload("detailPemainFutsal")
      .firstOrFail();
  }

  public async update({
    request,
    response,
    params: { id },
  }: HttpContextContract) {
    try {
      const {
        posisi,
        nomor_punggung,
        nickname,
        deskripsi,
        facebook,
        twitter,
        instagram,
        youtube,
        tiktok,
        cabor,
        tinggi_badan,
        berat_badan,
        tempat_lahir,
        pendidikan,
        foot,
      } = request.body();

      const foto = request.file("foto", {
        size: "2mb",
        extnames: ["jpg", "png", "jpeg", "svg"],
      });

      await foto?.move(Application.publicPath("foto/fotoPemain"));

      const fotoPemain = `${foto?.fileName?.toLowerCase()}-${
        new Date().getTime() + ""
      }.${foto?.extname}`;

      const pemain = await Pemain.query()
      .where({ id })
      .update({
        posisi: posisi,
        nomorPunggung: nomor_punggung,
        nickname: nickname,
        deskripsi: deskripsi,
        foto: `foto/fotoPemain/${fotoPemain}`,
        facebook: facebook,
        twitter: twitter,
        instagram: instagram,
        youtube: youtube,
        tiktok: tiktok,
      });

      if (cabor == "basket") {
        await DetailPemainBasket.query().where({ id }).update({
          tinggiBadan: tinggi_badan,
          beratBadan: berat_badan,
          tempatLahir: tempat_lahir,
        });
      } else {
        await DetailPemainFutsal.query().where({ id }).update({
          tinggiBadan: tinggi_badan,
          beratBadan: berat_badan,
          tempatLahir: tempat_lahir,
          pendidikan: pendidikan,
          foot: foot,
        });
      }

      return pemain;
    } catch (error) {
      return response.notFound(error);
    }
  }

  public async destroy({ params: { id } }: HttpContextContract) {
    return await Pemain.query().where({ id }).update({
      dihapus: 1,
    });
  }
}
