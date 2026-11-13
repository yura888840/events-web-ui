import { EventsCalendar, type CalendarEvent } from './EventsCalendar';

const demo: CalendarEvent[] = [
 [2,'Планирование месяца','work','10:00'],[5,'День рождения Анны','birthday',''],[7,'Дизайн-ревью','work','14:30'],[9,'Кофе с друзьями','personal','11:00'],[12,'Планирование спринта','work','10:00'],[14,'День рождения Максима','birthday',''],[15,'Презентация проекта','work','15:00'],[19,'Командная встреча','work','09:30'],[21,'Урок немецкого','personal','18:00'],[23,'Обсуждение проекта','work','11:00'],[23,'Семейный ужин','personal','19:00'],[24,'День рождения Аллы','birthday',''],[26,'Планирование недели','work','10:00'],[28,'Прогулка с друзьями','personal','17:00'],[30,'Итоги месяца','work','16:00']
].map(([day,name,category,time],i)=>({id:String(i),name:String(name),description:'Демонстрационное событие. Здесь может быть описание, заметка или подробности встречи.',year:2026,month:10,day:Number(day),type:category==='birthday'?'birthday':'other',recurrence:category==='birthday'?'yearly':'none',isActive:true,time:String(time),category:category==='work'?'work':'personal'}));

export default function EventsPage() {
  return <EventsCalendar events={demo} initialDate={new Date(2026, 9, 23)} />;
}
